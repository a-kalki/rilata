import { JwtConfig } from '#api/server/types.ts';
import { jwtHmacHashUtils } from '#api/utils/jwt/jwt-utils.ts';
import { JwtVerifyErrors } from '#core/jwt-errors.ts';
import { failure } from '#core/result/failure.ts';
import { Result } from '#core/result/types.ts';
import { DTO } from '#core/types.ts';
import { JwtDecoder } from '../jwt-decoder.ts';
import { JwtVerifier } from '../jwt-verifier.ts';

export class JwtVerifierImpl<PAYLOAD extends DTO> implements JwtVerifier<PAYLOAD> {
  constructor(
    protected jwtSecret: string,
    protected jwtConfig: JwtConfig,
    protected getJwtDecoder: JwtDecoder<PAYLOAD>,
  ) {}

  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD> {
    const { algorithm } = this.jwtConfig;
    if (!jwtHmacHashUtils.verify(rawToken, this.jwtSecret, algorithm === 'HS256' ? 'sha256' : 'sha512')) {
      return failure({
        name: 'Jwt verify error',
        type: 'app-error',
      });
    }
    return this.getJwtDecoder.getTokenPayload(rawToken);
  }
}
