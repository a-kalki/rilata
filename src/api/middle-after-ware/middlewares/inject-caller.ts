import { Caller } from '../../../core/caller.ts';
import { ResultDTO } from '../../../core/contract.ts';
import { JwtVerifyErrors } from '../../../core/jwt/jwt-errors.ts';
import { JwtDto } from '../../../core/jwt/types.ts';
import { RilataRequest } from '../../controller/types.ts';
import { JwtVerifier } from '../../jwt/jwt-verifier.ts';
import { ServerMiddleware } from '../server-middleware.ts';

export class InjectCallerMiddleware extends ServerMiddleware {
  constructor(private jwtVerifier: JwtVerifier<JwtDto>) {
    super();
  }

  process(req: RilataRequest): Response | undefined {
    let rawToken = req.headers.get('Authorization');
    if (!rawToken) {
      const caller: Caller = {
        type: 'AnonymousUser',
      };
      req.caller = caller;
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

    if (verifyResult.value.support?.isModerator) {
      const caller: Caller = {
        type: 'ModeratorUser',
        id: verifyResult.value.userId,
      };
      req.caller = caller;
      return;
    }

    const caller: Caller = {
      type: 'AuthUser',
      id: verifyResult.value.userId,
    };
    req.caller = caller;
  }
}
