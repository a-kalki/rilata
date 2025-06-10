import { BackendErrors } from '#core/errors.ts';
import { JwtDecodeErrors } from '#core/index.ts';

export type FrontendErrors = BackendErrors | JwtDecodeErrors;
