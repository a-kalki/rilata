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
    text: '',
    hint: {},
  }] },
  name: 'Validation error',
  type: 'app-error',
};

export type BadRequestError = {
  name: 'Bad request error',
  description?: string,
  type: 'app-error',
};

export type InvalidInputNameError = {
  name: 'Invalid input name error',
  description?: string,
  type: 'app-error',
};

export type NotFoundError = {
  name: 'Not found error',
  description?: string,
  type: 'app-error',
};

export type NetError = {
  name: 'Network error',
  description?: string,
  type: 'app-error',
};

export type InternalError = {
  name: 'Internal error',
  description?: string,
  type: 'app-error',
};

export type PermissionDeniedError = {
  name: 'Permission denied error',
  description?: string,
  type: 'app-error',
};

export type JwtVerifyError = {
  name: 'Jwt verify error',
  description?: string,
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
