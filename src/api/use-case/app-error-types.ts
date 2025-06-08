import { JwtDecodeErrors, JwtVerifyErrors } from '../../core/jwt/jwt-errors.js';
import { ArrayFieldErrors, FieldErrors } from '../../domain/validator/field-validator/types.js';
import { authPermissionDeniedError, badRequestError, badRequestInvalidCommandNameError, internalError, netError, notFoundError, permissionDeniedError } from './constants.ts';

export type ValidationError = {
  errors: FieldErrors | ArrayFieldErrors,
  name: 'Validation error',
  errorType: 'app-error',
}

export type BadRequestError = typeof badRequestError

export type BadRequestInvalidCommandNameError = typeof badRequestInvalidCommandNameError;

export type NotFoundError = typeof notFoundError;

export type NetError = typeof netError;

export type InternalError = typeof internalError;

export type PermissionDeniedError = typeof permissionDeniedError;

export type AuthPermissionDeniedError = typeof authPermissionDeniedError;

export type ServiceBaseErrors =
  BadRequestError
  | NotFoundError
  | NetError
  | PermissionDeniedError
  | InternalError
  | ValidationError
  | JwtDecodeErrors
  | JwtVerifyErrors;

export type BackendBaseErrors = ServiceBaseErrors;
