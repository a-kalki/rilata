/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtHmacHashUtils } from '#api/utils/jwt/jwt-utils.ts';
import { JwtDecodeErrors } from '#core/jwt-errors.ts';
import { failure } from '#core/result/failure.ts';
import { success } from '#core/result/success.ts';
import { Result } from '#core/result/types.ts';
import { UnionToTuple } from '#core/tuple-types.ts';
import { dtoUtility } from '#core/utils/dto/dto-utility.ts';
import { JwtDecoder } from '../jwt-decoder.ts';
import { JwtDto, JwtPayload, JwtType } from '../types.ts';

/** Класс для декодирования JWT токена. */
export class BunJwtDecoder<PAYLOAD extends JwtDto> implements JwtDecoder<PAYLOAD> {
  /** Уменьшает время реального истечения токена на указанное значение.
    Для бэка скорее всего 0, для фронта например 3000 */
  protected expiredTimeShiftAsMs: number;

  constructor(expiredTimeShiftAsMs = 0) {
    this.expiredTimeShiftAsMs = expiredTimeShiftAsMs;
  }

  /** Возвращает ответ, что тело payload соответвует требуемому */
  payloadBodyIsValid(payload: PAYLOAD): boolean {
    return true;
  }

  getTokenPayload(rawToken: string): Result<JwtDecodeErrors, PAYLOAD> {
    const decodedPayload = this.decodeJwt(rawToken);
    if (decodedPayload === undefined) return this.getError('Incorrect token error');

    if (this.dateIsExpired(decodedPayload)) return this.getError('Token expired error');

    const keys: Array<keyof JwtPayload<JwtDto>> = ['exp', 'typ'];
    const payload = dtoUtility.excludeAttrs(decodedPayload, keys) as unknown as PAYLOAD;
    return this.payloadBodyIsValid(payload) ? success(payload) : this.getError('Not valid token payload error');
  }

  getTokenType(rawToken: string): JwtType | undefined {
    const decodedPayload = this.decodeJwt(rawToken);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return decodedPayload?.typ;
  }

  dateIsExpired(rawOrPayload: string | JwtPayload<PAYLOAD>): boolean {
    const decodedPayload = typeof rawOrPayload === 'string'
      ? this.decodeJwt(rawOrPayload)
      : rawOrPayload;
    if (
      !decodedPayload
      || typeof decodedPayload?.exp !== 'number'
    ) return true;
    return (this.getNow() + this.expiredTimeShiftAsMs) - decodedPayload.exp > 0;
  }

  /** Добавлено для возможности мока в тестах */
  getNow(): number {
    return Date.now();
  }

  getError<E extends JwtDecodeErrors>(name: E['name']): Result<E, never> {
    if (name === 'Incorrect token error') {
      return failure({
        name: 'Incorrect token error',
        type: 'app-error',
      })as Result<E, never>;
    }
    if (name === 'Not valid token payload error') {
      return failure({
        name: 'Not valid token payload error',
        type: 'app-error',
      })as Result<E, never>;
    }
    return failure({
      name: 'Token expired error',
      type: 'app-error',
    }) as Result<E, never>;
  }

  protected decodeJwt(rawToken: string): JwtPayload<PAYLOAD> | undefined {
    try {
      const result = jwtHmacHashUtils.getPayload(rawToken);
      return (
        !result
        || typeof result !== 'object'
        || typeof result?.exp !== 'number'
        || typeof result?.typ !== 'string'
        || ['access', 'refresh'].includes(result.typ) === false
      ) ? undefined : result as JwtPayload<PAYLOAD>;
    } catch (err) {
      return undefined;
    }
  }
}
