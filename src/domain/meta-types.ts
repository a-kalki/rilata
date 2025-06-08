import { IdType } from '#core/index.ts';
import { RequestData } from '#core/request-data.ts';
import { DTO } from '#core/types.ts';

// доменное событие
export type EventMeta = {
  name: string; // имя для кода
  description: string; // описание для пользователя (документации)
  attrs: DTO, // атрибуты события
}

export type ErrorMeta = {
  name: string; // имя для кода
  description: string; // описание для пользователя приложения
  type: 'domain-error' // тип, что отделять ошибки домена от ошибок приложения
}

export type ARMeta = {
  name: string, // имя агрегата
  title: string, // название для пользователя
  description: string, // описание для пользователя (документации)
  attrs: { id: IdType } & DTO, // атрибуты агрегата
  events: EventMeta[]; // события которые может выпустить агрегат
}

export type InputMeta = {
  name: string, // имя команды
  attrs: DTO, // параметры команды
}

// событие от агрегата для публикации
export type ArPublishEventMeta = {
  name: string;
  attrs: {
    aRoot: ARMeta['attrs'],
    event: EventMeta['attrs']
  },
  requestData: RequestData // данные запроса которые привели к событию
  aRootName: string; // агрегат, хозяин события, заполняется при создании события
  aRootVersion: number;
}
