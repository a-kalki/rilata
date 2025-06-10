import { BackendErrors } from '#core/errors.ts';

/**
 * dispositionTypeMap - Карта типов disposition для заголовка Content-Disposition.
 * @property {string} inline - Отображает содержимое непосредственно в браузере.
 * @property {string} attachment - Принудительно загружает файл с указанным именем.
 */
export const dispositionTypeMap = {
  inline: 'inline',
  attachment: 'attachment',
};

/**
 * mimeTypesMap - Карта типов MIME, поддерживаемых в системе.
 */
export const mimeTypesMap = {
  html: 'text/html',
  txt: 'text/plain',
  json: 'application/json',
  js: 'application/javascript',
  css: 'text/css',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  pdf: 'application/pdf',
  zip: 'application/zip',
  mp3: 'audio/mpeg',
  ico: 'image/x-icon',
};

export const blobTypes = ['jpeg', 'jpg', 'png', 'pdf', 'zip', 'mp3', 'ico'];

/**
 * STATUS_CODES - Карта статусов HTTP, связанных с определенными ошибками.
 */
export const STATUS_CODES: Record<BackendErrors['name'], number> = {
  'Not found error': 404,
  'Permission denied error': 403,
  'Internal error': 500,
  'Bad request error': 400,
  'Validation error': 400,
  'Network error': 400,
  'Incorrect token error': 400,
  'Not valid token payload error': 400,
  'Token expired error': 400,
  'Jwt verify error': 400,
  'Invalid input name error': 400,
};
