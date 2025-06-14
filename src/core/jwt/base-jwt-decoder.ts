/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtDecodeErrors } from './jwt-errors.ts';
import { JwtDecoder } from './jwt-decoder.ts';
import { JwtDto, JwtPayload, JwtType } from './types.ts';
import { Result } from '../result/types.ts';
import { dtoUtility } from '../utils/dto/dto-utility.ts';
import { success } from '../result/success.ts';
import { urlUtils } from '../utils/url/url-utils.ts';
import { failure } from '../result/failure.ts';

/** Универсальный декодер JWT, подходит для фронта и бэка */
export class BaseJwtDecoder<PAYLOAD extends JwtDto> implements JwtDecoder<PAYLOAD> {
  protected expiredTimeShiftAsMs: number;

  constructor(expiredTimeShiftAsMs = 0) {
    this.expiredTimeShiftAsMs = expiredTimeShiftAsMs;
  }

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
    return decodedPayload?.typ;
  }

  dateIsExpired(rawOrPayload: string | JwtPayload<PAYLOAD>): boolean {
    const decodedPayload = typeof rawOrPayload === 'string'
      ? this.decodeJwt(rawOrPayload)
      : rawOrPayload;
    if (!decodedPayload || typeof decodedPayload.exp !== 'number') return true;
    return (this.getNow() + this.expiredTimeShiftAsMs) - decodedPayload.exp > 0;
  }

  getNow(): number {
    return Date.now();
  }

  getError<E extends JwtDecodeErrors>(name: E['name']): Result<E, never> {
    if (name === 'Incorrect token error') {
      return failure({ name: 'Incorrect token error', type: 'app-error' }) as Result<E, never>;
    }
    if (name === 'Not valid token payload error') {
      return failure({ name: 'Not valid token payload error', type: 'app-error' }) as Result<E, never>;
    }
    return failure({ name: 'Token expired error', type: 'app-error' }) as Result<E, never>;
  }

  protected decodeJwt(rawToken: string): JwtPayload<PAYLOAD> | undefined {
    try {
      const payloadAsBase64 = rawToken.split('.')[1];
      if (!payloadAsBase64) return undefined;

      const result = urlUtils.decodeFromBase64Url(payloadAsBase64);
      return (
        typeof result === 'object'
        && result !== null
        && typeof (result as any).exp === 'number'
        && typeof (result as any).typ === 'string'
        && ['access', 'refresh'].includes((result as any).typ)
      ) ? result as JwtPayload<PAYLOAD> : undefined;
    } catch (_) {
      return undefined;
    }
  }
}
