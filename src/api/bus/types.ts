import { RequestData } from '#core/request-data.ts';
import { ArPublishEventMeta } from '#domain/meta-types.ts';
import { UuidType } from '../../core/types.js';
import { BusPayloadAsJson } from '../database/types.js';

/** тип сообщения шины. Позволяет за раз подписаться на любое событие агрегата. */
export type BusMessageType = 'message' | 'event' | 'aggregate';

type SubcribeToBusBody = {
  publishNessageName: string, // имя сообщения на которое выполняется подписка (имя события)
  publishModuleName: string, // имя модуля которое публикует событие
  handlerModuleName: string, // имя модуля которое подписывается на событие
  handlerServiceName: string, // имя сервиса которая будет обрабатывать событие
}

export type SubcribeToMessage = SubcribeToBusBody & {
  type: 'message',
}

export type SubcribeToEvent = SubcribeToBusBody & {
  type: 'event',
}

export type SubcribeToAggregate = SubcribeToBusBody & {
  type: 'aggregate',
}

/** Тип для подписки в шину */
export type SubcribeToBusMessage = SubcribeToMessage | SubcribeToEvent | SubcribeToAggregate;

export type MessageBodyType = {
  id: UuidType,
  name: string,
  attrs: BusPayloadAsJson,
  requestData?: RequestData // с событием заполняется, с сообщением возможно нет
  isPublished: 0 | 1,
}

export type EventBodyType = MessageBodyType & Omit<ArPublishEventMeta, 'attrs'> & {
  type: 'event'
};

export type DeliveryMessage = MessageBodyType & {
  type: 'message',
}

export type DeliveryEvent = EventBodyType & {
  type: 'event',
}

/** Тип для доставщика в шину */
export type DeliveryBusMessage = DeliveryMessage | DeliveryEvent;

type PublishBodyType = {
  publishModuleName: string,
}
export type PublishMessage = DeliveryMessage & PublishBodyType;

export type PublishEvent = DeliveryEvent & PublishBodyType;

/** Тип для публикации в шину */
export type PublishBusMessage = PublishMessage | PublishEvent;
