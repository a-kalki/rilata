import { Caller } from '../../core/caller.ts';
import { Logger } from '../helper.index.ts';
import {
  CanPerformHandlerCallback,
  CanPerformPayload,
  GetContentHandlerCallback,
  GetContentPayload,
} from './types.ts';
import { ModuleMediator } from './module-mediator.ts';
import { Result } from '../../core/result/types.ts';
import { failure } from '../../core/result/failure.ts';
import { NotContentToDeliveryError } from '../../core/module-mediator/types.ts';

/** Реализация ModuleMediator для монолитного сервера. */
export class MonolithModuleMediator implements ModuleMediator {
  // Для обработчиков разрешений
  private permissionHandlers: Map<string, CanPerformHandlerCallback> = new Map();

  // Для обработчиков получения контента (подсказок)
  private contentHandlers: Map<string, GetContentHandlerCallback> = new Map();

  constructor(protected logger: Logger) {}

  registerPerformHandler(
    abstractAggregateName: string,
    ownerAggregateName: string,
    handler: CanPerformHandlerCallback,
  ): void {
    const key = this.getKey(abstractAggregateName, ownerAggregateName);
    if (this.permissionHandlers.has(key)) {
      throw this.logger.error(`[MonolithModuleMediator] Overwriting permission handler for ${key}`);
    }
    this.permissionHandlers.set(key, handler);
  }

  async canPerform(
    abstractAggregateName: string,
    payload: CanPerformPayload,
    caller: Caller,
  ): Promise<boolean> {
    const key = this.getKey(abstractAggregateName, payload.ownerAggregateAttrs.ownerName);
    const handler = this.permissionHandlers.get(key);

    if (!handler) {
      this.logger.error(
        `[MonolithModuleMediator] No permission handler registered for ${key}. Denying access.`,
        { key, abstractAggregateName, payload, caller },
      );
      return false;
    }

    try {
      return await handler(payload, caller);
    } catch (error) {
      this.logger.error(
        `[MonolithModuleMediator] Error during permission check for ${key}:`,
        { abstractAggregateName, payload, caller, error: error as Error },
      );
      return false;
    }
  }

  registerContentHandler(
    abstractAggregateName: string,
    ownerAggregateName: string,
    handler: GetContentHandlerCallback,
  ): void {
    const key = this.getKey(abstractAggregateName, ownerAggregateName);
    if (this.contentHandlers.has(key)) {
      throw this.logger.error(`[MonolithModuleMediator] Overwriting content handler for ${key}`);
    }
    this.contentHandlers.set(key, handler);
  }

  async getContent<T>(
    abstractAggregateName: string,
    payload: GetContentPayload,
    caller: Caller,
  ): Promise<Result<NotContentToDeliveryError, T>> {
    const { ownerName } = payload.ownerAggregateAttrs;
    const key = this.getKey(abstractAggregateName, ownerName);
    const handler = this.contentHandlers.get(key);

    if (!handler) {
      this.logger.error(
        `[MonolithModuleMediator] No content handler registered for ${key}. Returning empty result.`,
        { key, abstractAggregateName, payload, caller },
      );
      return failure({
        name: 'NotContentToDeliveryError',
        description: 'Not finded content deliverer.',
        type: 'domain-error',
      });
    }

    return (await handler(payload, caller)) as Result<NotContentToDeliveryError, T>;
  }

  private getKey(abstractAggregateName: string, ownerAggregateType: string): string {
    return `${abstractAggregateName}#${ownerAggregateType}`;
  }
}
