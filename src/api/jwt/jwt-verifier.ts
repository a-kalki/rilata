import { JwtVerifyErrors } from '#core/jwt-errors.ts';
import { DTO } from '#core/types.ts';
import { Result } from '../../core/result/types.js';

export interface JwtVerifier<PAYLOAD extends DTO> {
  /** Проверяет токен на соответствие шифрованию секретом */
  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD>
}
