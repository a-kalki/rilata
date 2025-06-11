import { JwtDecoder } from '../../api/jwt/jwt-decoder.ts';
import { JwtDto } from '../../api/jwt/types.ts';
import { Logger } from '../../api/logger/logger.ts';
import { InputMeta } from '../../core/app-meta.ts';
import { BackendResult } from '../../core/contract.ts';
import { BadRequestError } from '../../core/errors.ts';
import { failure } from '../../core/result/failure.ts';
import { Result } from '../../core/result/types.ts';
import { dtoUtility } from '../../core/utils/dto/dto-utility.ts';
import { BackendApi } from './backend-api.ts';

export class JwtBackendApi extends BackendApi {
  constructor(
    moduleUrl: string,
    protected jwtDecoder: JwtDecoder<JwtDto>,
    protected logger: Logger,
  ) {
    super(moduleUrl);
  }

  async request(requestDod: InputMeta, jwtToken: string): Promise<BackendResult> {
    if (jwtToken && this.jwtDecoder.dateIsExpired(jwtToken)) {
      return this.jwtDecoder.getError('Token expired error');
    }

    return super.request(requestDod);
  }

  getRequestBody(payload: unknown, jwtToken: string): Record<string, unknown> {
    return dtoUtility.extendAttrs(
      super.getRequestBody(payload),
      {
        headers: { Authorization: jwtToken ? `Bearer ${jwtToken}` : '' },
      },
    );
  }

  protected notResultDto(value: unknown): Result<BadRequestError, never> {
    this.logger.error('response value is not resultDto', value);
    return failure({
      name: 'Bad request error',
      type: 'app-error',
    });
  }
}
