import { wholeValueValidationErrorKey } from '../domain/validator/constants.ts';
import { ArrayFieldErrors, FieldErrors } from '../domain/validator/field-validator/types.ts';
import { JwtVerifyErrors } from './jwt/jwt-errors.ts';

export type ValidationError = {
  errors: FieldErrors | ArrayFieldErrors,
  name: 'Validation error',
  type: 'app-error',
}

export const wholeValueValidationError: ValidationError = {
  errors: { [wholeValueValidationErrorKey]: [{
    name: 'Not valid request body',
    text: 'Генерируется и возвращается в случае на валидного запроса на уровне use case',
    hint: {},
  }] },
  name: 'Validation error',
  type: 'app-error',
};

export type BadRequestError = {
  name: 'Bad request error',
  description?: 'Возвращается в случае некорректного запроса',
  type: 'app-error',
};

export type InvalidInputNameError = {
  name: 'Invalid input name error',
  description?: 'Возвращается в случае если не была найдена обрабатывающая команду (input) use case',
  type: 'app-error',
};

export type NotFoundError = {
  name: 'Not found error',
  description?: 'Возвращается в случае если в запросе не валидный url',
  type: 'app-error',
};

export type NetError = {
  name: 'Network error',
  description?: 'Возвращается в случае ошибок в запросах от модуля в сторонние сервисы',
  type: 'app-error',
};

export type InternalError = {
  name: 'Internal error',
  description?: 'Возвращается в случае непредвиденной ошибки на сервере',
  type: 'app-error',
};

export type PermissionDeniedError = {
  name: 'Permission denied error',
  description?: 'Возвращается когда действие допустимо только для авторизированных лиц',
  type: 'app-error',
};

export type JwtVerifyError = {
  name: 'Jwt verify error',
  description?: 'Возвращается когда действие допустимо только для авторизированных лиц',
  type: 'app-error',
};

export type UCBaseErrors =
  BadRequestError
  | NotFoundError
  | NetError
  | InvalidInputNameError
  | PermissionDeniedError
  | InternalError
  | ValidationError
  | JwtVerifyError;

export type BackendErrors = UCBaseErrors | JwtVerifyErrors;
