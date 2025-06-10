import { JwtVerifyErrors } from '#core/jwt-errors.ts';
import { Result } from '../../core/result/types.ts';
import { JwtDto } from './types.ts';

export interface JwtVerifier<PAYLOAD extends JwtDto> {
  /** Проверяет токен на соответствие шифрованию секретом */
  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD>
}
