import { Caller } from '../../core/caller.ts';
import { NotContentToDeliveryError, OwnerAggregateAttrs } from '../../core/module-mediator/types.ts';
import { Result } from '../../core/result/types.ts';

export type CanPerformPayload = {
  ownerAggregateAttrs: OwnerAggregateAttrs, // данные агрегата владельца
  action: string, // авполяемое действие
}

export type CanPerformHandlerCallback = (
  payload: CanPerformPayload, // полезная нагрузка
  caller: Caller // для кого нужно выполнить проверку
) => Promise<boolean>;

export type GetContentPayload = {
  ownerAggregateAttrs: OwnerAggregateAttrs, // данные агрегата владельца
  contentType: string, // какие данные запрашиваются
}

export type GetContentHandlerCallback = (
  payload: GetContentPayload,
  caller: Caller
) => Promise<Result<NotContentToDeliveryError, unknown>>
