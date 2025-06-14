import { JwtDecoder } from '../../../core/jwt/jwt-decoder.ts';
import { JwtVerifyErrors } from '../../../core/jwt/jwt-errors.ts';
import { JwtDto } from '../../../core/jwt/types.ts';
import { failure } from '../../../core/result/failure.ts';
import { Result } from '../../../core/result/types.ts';
import { JwtConfig } from '../../server/types.ts';
import { jwtHmacHashUtils } from '../../utils/jwt/jwt-utils.ts';
import { JwtVerifier } from '../jwt-verifier.ts';

export class BunJwtVerifier<PAYLOAD extends JwtDto> implements JwtVerifier<PAYLOAD> {
  constructor(
    protected jwtSecret: string,
    protected jwtConfig: JwtConfig,
    protected jwtDecoder: JwtDecoder<PAYLOAD>,
  ) {}

  verifyToken(rawToken: string): Result<JwtVerifyErrors, PAYLOAD> {
    const { algorithm } = this.jwtConfig;
    if (!jwtHmacHashUtils.verify(rawToken, this.jwtSecret, algorithm === 'HS256' ? 'sha256' : 'sha512')) {
      return failure({
        name: 'Jwt verify error',
        type: 'app-error',
      });
    }
    return this.jwtDecoder.getTokenPayload(rawToken);
  }
}
