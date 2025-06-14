import { Result } from '../result/types.ts';
import { JwtDecodeErrors } from './jwt-errors.ts';
import { JwtDto, JwtPayload, JwtType } from './types.ts';

export interface JwtDecoder<PAYLOAD extends JwtDto> {
  /** Декодировать токен и получить его payload.
    Не проверяется валидность (соответствие секретному шифрованию). */
  getTokenPayload(rawToken: string): Result<JwtDecodeErrors, PAYLOAD>;

  getTokenType(rawToken: string): JwtType | undefined;

  /** Возваращает ошибки jwt, добавлена как публичная для jwtCreator, jwtVerifier */
  getError<E extends JwtDecodeErrors>(name: E['name']): Result<E, never>

  /** Истекла ли дата токена. Если токен некорректный, то возвращает true. */
  dateIsExpired(rawOrPayload: string | JwtPayload<PAYLOAD>): boolean

  /** Добавлено для возможности мока в тестах */
  getNow(): number
}
