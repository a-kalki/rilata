import { UCMeta } from "../../core/app-meta.ts";
import { BackendResult, BackendResultByMeta, BackendResultDTO } from "../../core/contract.ts";
import { JwtDecoder } from "../../core/jwt/jwt-decoder.ts";
import { JwtDto } from "../../core/jwt/types.ts";
import { failure } from "../../core/result/failure.ts";
import { success } from "../../core/result/success.ts";

/** Обертка для кэшируемых данных с временной меткой. */
type Timestamped<DataT> = {
  data: DataT;
  timestamp: number;
};

export abstract class BackendApi<T> {
  protected abstract cacheTtlAsMin: number;

  protected abstract accessToken?: string;

  protected abstract refreshToken?: string;

  protected abstract updateAccessToken(): Promise<void>;

  // Унифицированное хранилище для всех типов кэша
  // Ключ - это конкатенация типа кэша и ID элемента.
  // Например: 'main_by_id_article123', 'other_by_id_tag456', 'main_list'
  private unifiedCache: Record<string, Timestamped<unknown>> = {};

  constructor(protected moduleUrl: string, protected jwtDecoder: JwtDecoder<JwtDto>) { }

  protected getTtlTimestampAsMs(): number {
    return this.cacheTtlAsMin * 60 * 1000;
  }

  /** Основной метод запроса в бэкенд */
  protected async request<META extends UCMeta>(dto: META['in']): Promise<BackendResultByMeta<META>> {
    const token = this.accessToken;

    try {
      if (token && this.jwtDecoder.dateIsExpired(token)) {
        if (!this.refreshToken || this.jwtDecoder.dateIsExpired(this.refreshToken)) {
          return failure({ name: 'Token expired error', type: 'app-error' });
        }
        await this.updateAccessToken();
      }

      const backendResult = await fetch(this.moduleUrl, this.getRequestBody(dto));
      const resultDto = await backendResult.json();
      return this.dtoResultToResult(resultDto);
    } catch (e) {
      const err = e as Error;
      if (err.message === 'Failed to fetch') {
        return failure({ name: 'Network error', type: 'app-error' });
      }
      return failure({ name: 'Bad request error', type: 'app-error' });
    }
  }

  /** Собирает тело запроса */
  protected getRequestBody(payload: unknown): Record<string, unknown> {
    const auth = this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {};
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...auth,
      },
      body: JSON.stringify(payload),
    };
  }

  /** Конвертация результата */
  protected dtoResultToResult(resultDto: BackendResultDTO): BackendResult {
    if (resultDto.success === false) return failure(resultDto.payload);
    if (resultDto.success === true) return success(resultDto.payload);
    return failure({ name: 'Bad request error', type: 'app-error' });
  }

  // ==== ↓↓↓ Внутренние унифицированные методы для работы с кэшем ↓↓↓ ====

  /**
   * Внутренний метод для получения данных из унифицированного кэша.
   * @param cacheKey Уникальный ключ для элемента в кэше (например, 'main_by_id_article123').
   * @param forceRefresh Если true, игнорировать кэш и считать его устаревшим.
   * @returns Данные из кэша или undefined, если не найдены или устарели.
   */
  private getFromUnifiedCache<DataT>(cacheKey: string, forceRefresh?: boolean): DataT | undefined {
    const entry = this.unifiedCache[cacheKey] as Timestamped<DataT>; // Приводим тип здесь
    if (!entry) return undefined;
    if (forceRefresh || Date.now() - entry.timestamp > this.getTtlTimestampAsMs()) {
      delete this.unifiedCache[cacheKey];
      return undefined;
    }
    return entry.data;
  }

  /**
   * Внутренний метод для установки данных в унифицированный кэш.
   * @param cacheKey Уникальный ключ для элемента в кэше.
   * @param data Данные для кэширования.
   */
  private setUnifiedCache<DataT>(cacheKey: string, data: DataT): void {
    this.unifiedCache[cacheKey] = { data, timestamp: Date.now() };
  }

  /**
   * Внутренний метод для удаления данных из унифицированного кэша.
   * @param cacheKey Уникальный ключ элемента для удаления.
   */
  private removeFromUnifiedCache(cacheKey: string): void {
    delete this.unifiedCache[cacheKey];
  }

  // ==== ↓↓↓ КЕШ ПО ID И СПИСКУ ДЛЯ ОСНОВНОГО ТИПА T (Использует унифицированное решение) ↓↓↓ ====

  /** Получить из кеша по ID для основного типа T */
  protected getFromCacheById(id: string, forceRefresh?: boolean): T | undefined {
    return this.getFromUnifiedCache<T>(`main_by_id_${id}`, forceRefresh);
  }

  /** Установить кеш по ID для основного типа T */
  protected setCacheById(id: string, data: T): void {
    this.setUnifiedCache<T>(`main_by_id_${id}`, data);
  }

  /** Удалить кеш по ID для основного типа T */
  protected removeFromCacheById(id: string): void {
    this.removeFromUnifiedCache(`main_by_id_${id}`);
  }

  /** Получить список из кеша для основного типа T */
  protected getFromCacheList(forceRefresh?: boolean): T[] | undefined {
    return this.getFromUnifiedCache<T[]>('main_list', forceRefresh);
  }

  /** Установить кеш для списка для основного типа T */
  protected setCacheList(data: T[]): void {
    this.setUnifiedCache<T[]>('main_list', data);
  }

  /** Удалить кеш списка для основного типа T */
  protected removeListCache(): void {
    this.removeFromUnifiedCache('main_list');
  }

  // ==== ↓↓↓ НОВЫЕ МЕТОДЫ КЕША ДЛЯ ДРУГИХ ТИПОВ (Используют унифицированное решение) ↓↓↓ ====

  /**
   * Получить из кеша по ID для произвольного типа DataT.
   * Тип данных указывается в дженерике метода: `api.getOtherFromCacheById<Tag>('tag-id')`
   * @param id ID элемента.
   * @param typeTag Строка-идентификатор для разделения кешей разных типов ('tag', 'category').
   * @param forceRefresh Если true, игнорировать кэш и считать его устаревшим.
   * @returns Данные из кэша или undefined.
   */
  protected getOtherFromCacheById<DataT>(
    id: string, typeTag: string, forceRefresh?: boolean,
  ): DataT | undefined {
    return this.getFromUnifiedCache<DataT>(`other_by_id_${typeTag}_${id}`, forceRefresh);
  }

  protected clearCacheKeysByPrefix(prefix: string): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.unifiedCache) {
      if (key.startsWith(prefix)) {
        delete this.unifiedCache[key];
      }
    }
  }

  /**
   * Установить кеш по ID для произвольного типа DataT.
   * Тип данных указывается в дженерике метода.
   * @param id ID элемента.
   * @param data Данные для кэширования.
   * @param typeTag Строка-идентификатор для разделения кешей разных типов.
   */
  protected setOtherCacheById<DataT>(id: string, data: DataT, typeTag: string): void {
    this.setUnifiedCache<DataT>(`other_by_id_${typeTag}_${id}`, data);
  }

  /**
   * Удалить кеш по ID для произвольного типа DataT.
   * @param id ID элемента.
   * @param typeTag Строка-идентификатор для разделения кешей разных типов.
   */
  protected removeOtherFromCacheById(id: string, typeTag: string): void {
    this.removeFromUnifiedCache(`other_by_id_${typeTag}_${id}`);
  }

  /**
   * Получить список из кеша для произвольного типа DataT.
   * @param typeTag Строка-идентификатор для разделения кешей разных типов
      (например, 'tag_list', 'category_list').
   * @param forceRefresh Если true, игнорировать кэш и считать его устаревшим.
   * @returns Массив данных из кэша или undefined.
   */
  protected getOtherFromCacheList<DataT>(
    typeTag: string, forceRefresh?: boolean,
  ): DataT[] | undefined {
    return this.getFromUnifiedCache<DataT[]>(`other_list_${typeTag}`, forceRefresh);
  }

  /**
   * Установить кеш для списка для произвольного типа DataT.
   * @param data Массив данных для кэширования.
   * @param typeTag Строка-идентификатор для разделения кешей разных типов.
   */
  protected setOtherCacheList<DataT>(data: DataT[], typeTag: string): void {
    this.setUnifiedCache<DataT[]>(`other_list_${typeTag}`, data);
  }

  /**
   * Удалить кеш списка для произвольного типа DataT.
   * @param typeTag Строка-идентификатор для разделения кешей разных типов.
   */
  protected removeOtherListCache(typeTag: string): void {
    this.removeFromUnifiedCache(`other_list_${typeTag}`);
  }

  /** Очистить весь кеш */
  protected clearCache(): void {
    this.unifiedCache = {}; // Просто сбрасываем весь унифицированный кэш
  }
}
