import { Caller } from '#core/request-data.ts';
import { dispositionTypeMap, mimeTypesMap } from './constants.js';

export type ResultDTO<FAIL, SUCCESS> = {
  success: false,
  httpStatus: number,
  payload: FAIL,
} | {
  success: true,
  httpStatus: number,
  payload: SUCCESS,
};

export type RilataRequest =
  Request
  & { caller: Caller }
  & { headers: Headers & { Authorization: string } }

/**
 * MimeTypes - Типы MIME, поддерживаемые в системе. Определены в `mimeTypesMap`.
 */
export type MimeTypes = keyof typeof mimeTypesMap;

/**
 * DispositionTypes - Типы disposition для Content-Disposition заголовка.
 * Определены в `dispositionTypeMap`.
 */
export type DispositionTypes = keyof typeof dispositionTypeMap;

/**
 * ResponseFileOptions - Опции для создания ответа Response с файлом.
 * @property {MimeTypes} [mimeType] - Тип MIME для файла. По умолчанию 'txt'.
 * @property {number} [status] - HTTP статус для ответа. По умолчанию 200.
 * @property {boolean} [shouldCompress] - Указывает, надо ли сжимать файл в zip. По умолчанию true.
 * @property {'br' | 'gzip' | 'deflate'} [compressionFormat] - Формат компрессии.
   По умолчанию 'json'. Актуально только в случае shouldCompress = true.
 * @property {DispositionTypes} [disposition] - Значение для Content-Disposition заголовка.
   По умолчанию 'inline'.
 */
export type ResponseFileOptions = {
  mimeType?: MimeTypes, // default 'json'
  status?: number, // default 200
  disposition?: DispositionTypes // default inline
}
