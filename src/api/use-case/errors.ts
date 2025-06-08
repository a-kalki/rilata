import { AppErrorMeta } from '#domain/meta-types.ts';
import { wholeValueValidationErrorKey } from '#domain/validator/constants.ts';
import { ValidationError } from './error-types.ts';

export const wholeValueValidationError: ValidationError = {
  errors: { [wholeValueValidationErrorKey]: [{
    name: 'Not valid request body',
    text: 'Базовая ошибка валидации всего тела запроса',
    hint: {},
  }] },
  name: 'Validation error',
  errorType: 'app-error',
};

export const badRequestError: AppErrorMeta = {
  name: 'Bad request error',
  description: 'Произведен некорректный запрос',
  type: 'app-error',
};

export const badRequestInvalidCommandNameError: AppErrorMeta = {
  name: 'Bad request, invalid command name',
  description: 'Произведен некорректный запрос. Похоже причины в приложении. Перезагрузите страницу.',
  type: 'app-error',
};

export const notFoundError: AppErrorMeta = {
  name: 'Not found',
  description: 'Ресурс не найден',
  type: 'app-error',
};

export const netError: AppErrorMeta = {
  name: 'Network error',
  description: 'Произошли ошибки в сети. Попробуйте позже.',
  type: 'app-error',
};

export const internalError: AppErrorMeta = {
  name: 'Internal error',
  description: 'На сервере произошла ошибка. Попробуйте перезегрузить приложение.',
  type: 'app-error',
};

export const permissionDeniedError: AppErrorMeta = {
  name: 'Permission denied',
  description: 'Действие недопустимо',
  type: 'app-error',
};

export const authPermissionDeniedError: AppErrorMeta = {
  name: 'Permission denied. Only for authenticated users',
  description: 'Действие доступно только для аутентифицированных пользователей.',
  type: 'app-error',
};
