import { JwtVerifyErrors } from '../../core/jwt/jwt-errors.ts';
import { JwtDto } from '../../core/jwt/types.ts';
import { Result } from '../../core/result/types.ts';

export interface JwtVerifier<PAYLOAD extends JwtDto> {
  /** Проверяет токен на соответствие шифрованию секретом */
  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD>
}
