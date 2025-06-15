import {
  BackendResult, BackendResultByMeta, BackendResultDTO, JwtDecoder, JwtDto,
  failure, success, UCMeta,
} from '../../core/index.ts';

type Timestamped<T> = {
  data: T;
  timestamp: number;
};

export abstract class BackendApi<T> {
  protected abstract cacheTtlAsMin: number;

  protected abstract accessToken?: string;

  protected abstract refreshToken?: string;

  protected abstract updateAccessToken(): Promise<void>;

  private cacheById: Record<string, Timestamped<T>> = {};

  private cacheList?: Timestamped<T[]>;

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
      return this.resultDtoToResult(resultDto);
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
  protected resultDtoToResult(resultDto: BackendResultDTO): BackendResult {
    if (resultDto.success === false) return failure(resultDto.payload);
    if (resultDto.success === true) return success(resultDto.payload);
    return failure({ name: 'Bad request error', type: 'app-error' });
  }

  // ==== ↓↓↓ КЕШ ПО ID И СПИСКУ ↓↓↓ ====

  /** Получить из кеша по ID */
  protected getFromCacheById(id: string, forceRefresh?: boolean): T | undefined {
    const entry = this.cacheById[id];
    if (!entry) return undefined;
    if (forceRefresh || Date.now() - entry.timestamp > this.getTtlTimestampAsMs()) {
      delete this.cacheById[id];
      return undefined;
    }
    return entry.data;
  }

  /** Установить кеш по ID */
  protected setCacheById(id: string, data: T): void {
    this.cacheById[id] = { data, timestamp: Date.now() };
  }

  /** Удалить кеш по ID */
  protected removeFromCacheById(id: string): void {
    delete this.cacheById[id];
  }

  /** Получить список из кеша */
  protected getFromCacheList(forceRefresh?: boolean): T[] | undefined {
    if (!this.cacheList) return undefined;
    if (forceRefresh || Date.now() - this.cacheList.timestamp > this.getTtlTimestampAsMs()) {
      this.cacheList = undefined;
      return undefined;
    }
    return this.cacheList.data;
  }

  /** Установить кеш для списка */
  protected setCacheList(data: T[]): void {
    this.cacheList = { data, timestamp: Date.now() };
  }

  /** Удалить кеш списка */
  protected removeListCache(): void {
    this.cacheList = undefined;
  }

  /** Очистить весь кеш */
  protected clearCache(): void {
    this.cacheById = {};
    this.cacheList = undefined;
  }
}
