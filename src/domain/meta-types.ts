import { Caller } from '#core/caller.ts';
import { DTO, IdType } from '#core/types.ts';

// доменное событие
export type EventMeta = {
  name: string; // имя для кода
  requestId: string;
  description?: string; // описание для пользователя (документации)
  attrs: DTO, // атрибуты события
}

export type DomainErrorMeta = {
  name: string; // имя для кода
  description?: string; // описание для пользователя (документации)
  type: 'domain-error' // тип, что отделять ошибки домена от ошибок приложения
}

export type ARMeta = {
  name: string, // имя агрегата
  title: string, // название для пользователя
  description?: string, // описание для пользователя (документации)
  attrs: { id: IdType } & DTO, // атрибуты агрегата
  events: EventMeta[]; // события которые может выпустить агрегат
}

// событие от агрегата для публикации
export type ArPublishEvent = Omit<EventMeta, 'attrs' | 'description'> & {
  id: string,
  attrs: {
    aRoot: ARMeta['attrs'],
    event: EventMeta['attrs']
  },
  caller: Caller // данные запроса которые привели к событию
  aRootName: string; // агрегат, хозяин события, заполняется при создании события
  aRootId: string,
  aRootVersion: number;
  createdAt: number,
}
