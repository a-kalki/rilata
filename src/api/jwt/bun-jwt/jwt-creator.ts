import { JwtConfig } from '#api/server/types.ts';
import { jwtHmacHashUtils } from '#api/utils/jwt/jwt-utils.ts';
import { JwtCreator } from '../jwt-creator.ts';
import { JwtDecoder } from '../jwt-decoder.ts';
import { JwtDto, JwtPayload, JwtType } from '../types.ts';

export class BunJwtCreator<PAYLOAD extends JwtDto> implements JwtCreator<PAYLOAD> {
  constructor(
    protected jwtSecret: string,
    protected jwtConfig: JwtConfig,
    protected jwtDecoder: JwtDecoder<PAYLOAD>,
  ) {}

  createToken(payload: PAYLOAD, type: JwtType): string {
    return jwtHmacHashUtils.sign(
      this.getJwtPayload(payload, type),
      this.jwtSecret,
      this.jwtConfig.algorithm === 'HS256' ? 'sha256' : 'sha512',
    );
  }

  protected getJwtPayload(payload: PAYLOAD, typ: JwtType): JwtPayload<PAYLOAD> {
    const expiredAsHour = typ === 'access'
      ? this.jwtConfig.jwtLifetimeAsHour
      : this.jwtConfig.jwtRefreshLifetimeAsHour;
    const iat = this.jwtDecoder.getNow();

    const jwtLifetimeAsMs = expiredAsHour * 60 * 60 * 1000;
    const exp = iat + jwtLifetimeAsMs;

    return { ...payload, exp, typ };
  }
}
