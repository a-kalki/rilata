import { Caller } from '../../core/caller.ts';
import { NotContentToDeliveryError } from '../../core/module-mediator/types.ts';
import { Result } from '../../core/result/types.ts';
import {
  GetContentHandlerCallback, CanPerformHandlerCallback, GetContentPayload, CanPerformPayload,
} from './types.ts';

/**
 * Интерфейс для обмена информацией между модулями.
 * Используется в основном для синхронного общения абстрактного модуля с более конкретным.
 * Конкретные модули определяющие бизнес логику, дают ответы для абстрактного модуля.
 * Решает проблему инверсии зависимости, когда абстрактный агрегат (модуль)
 * должен получить ответ от конкретного агрегата, использующего абстрактный.
 * Может использоваться как для проверки прав, так и для запроса данных.
 */
export interface ModuleMediator {
  registerPerformHandler(
    abstractAggregateName: string,
    ownerAggregateName: string,
    handler: CanPerformHandlerCallback
  ): void;

  canPerform(
    abstractAggregateName: string,
    payload: CanPerformPayload,
    caller: Caller
  ): Promise<boolean>;

  /**
   * Регистрирует обработчик для получения контента от владельца.
   */
  registerContentHandler(
    abstractAggregateName: string,
    ownerAggregateName: string,
    handler: GetContentHandlerCallback
  ): void;

  /**
   * Запрашивает контент, который нужно показать пользователю.
   */
  getContent<T>(
    abstractAggregateName: string,
    payload: GetContentPayload, // caller теперь в самом payload
    caller: Caller, // Дублируем caller для явности в этом методе
  ): Promise<Result<NotContentToDeliveryError, T>>;
}
