import { BackendErrors } from '../../../core/errors.ts';

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
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  zip: 'application/zip',
  mp3: 'audio/mpeg',
  ico: 'image/x-icon',
  bmp: 'image/bmp',
  webp: 'image/webp',
  gif: 'image/gif',
  tiff: 'image/tiff',
  avif: 'image/avif',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  rtf: 'application/rtf',
  odt: 'application/vnd.oasis.opendocument.text',
  csv: 'text/csv',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  avi: 'video/x-msvideo',
  mov: 'video/quicktime',
  wav: 'audio/wav',
  flac: 'audio/flac',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  otf: 'font/otf',
};

export const blobTypes = Object.keys(mimeTypesMap);

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
