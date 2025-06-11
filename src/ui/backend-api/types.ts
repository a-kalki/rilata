import { BackendErrors } from '../../core/errors.ts';
import { JwtDecodeErrors } from '../../core/jwt-errors.ts';

export type FrontendErrors = BackendErrors | JwtDecodeErrors;
