import { JwtVerifier } from '#api/jwt/jwt-verifier.ts';
import { ResultDTO } from '#core/contract.ts';
import { JwtVerifyErrors } from '#core/jwt-errors.ts';
import { RilataRequest } from '../../controller/types.ts';
import { ServerMiddleware } from '../server-middleware.ts';

export class InjectCallerMiddleware extends ServerMiddleware {
  constructor(private jwtVerifier: JwtVerifier<{ userId: string }>) {
    super();
  }

  process(req: RilataRequest): Response | undefined {
    let rawToken = req.headers.get('Authorization');
    if (!rawToken) {
      req.caller = {
        type: 'AnonymousUser',
      };
      return;
    }

    rawToken = rawToken?.includes('Bearer ') ? rawToken.replace('Bearer ', '') : rawToken;
    const verifyResult = this.jwtVerifier.verifyToken(rawToken);
    if (verifyResult.isFailure()) {
      const respBody: ResultDTO<JwtVerifyErrors, never> = {
        success: false,
        payload: verifyResult.value,
        httpStatus: 400,
      };
      // eslint-disable-next-line consistent-return
      return new Response(JSON.stringify(respBody), { status: 400 });
    }

    req.caller = {
      type: 'AuthUser',
      userId: verifyResult.value.userId,
    };
  }
}
