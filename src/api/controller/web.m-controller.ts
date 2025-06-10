import { ModuleMeta, Resolvers, Urls } from '#api/module/types.ts';
import { WebModule } from '#api/module/web.module.js';
import { BackendBaseErrors, BadRequestError } from '#api/use-case/errors.ts';
import { RequestScope } from '#core/index.ts';
import { failure } from '#core/result/failure.js';
import { success } from '#core/result/success.js';
import { Result } from '#core/result/types.js';
import { STATUS_CODES } from '#core/utils/response/constants.ts';
import { responseUtility } from '#core/utils/response/response-utility.js';
import { Controller } from './controller.ts';
import { ResultDTO, RilataRequest } from './types.js';

export class WebModuleController implements Controller {
  constructor(protected module: WebModule<ModuleMeta>, protected resolvers: Resolvers) {}

  getUrls(): Urls {
    return this.resolvers.moduleResolver.moduleUrls;
  }

  /** Переводит http на requestDod и serviceResult на Response<ResultDTO> */
  async execute(req: RilataRequest): Promise<Response> {
    const inputDataResult = await this.getInputData(req);
    if (inputDataResult.isFailure()) return this.getFailureResponse(inputDataResult.value);
    const reqJsonBody = inputDataResult.value;
    const reqScope: RequestScope = {
      caller: req.caller,
    };

    const ucResult = await this.module.handleRequest(reqJsonBody, reqScope);
    if (ucResult.isSuccess()) {
      return this.getSuccessResponse(ucResult.value);
    }
    const err = (ucResult as Result<BackendBaseErrors, never>).value;
    return this.getFailureResponse(err);
  }

  protected async getInputData(req: RilataRequest): Promise<Result<BadRequestError, unknown>> {
    if (req.method !== 'POST') {
      return failure({
        name: 'Bad request error',
        type: 'app-error',
      });
    }

    try {
      return success(await req.json());
    } catch (e) {
      return failure({
        name: 'Bad request error',
        type: 'app-error',
      });
    }
  }

  protected getSuccessResponse(serviceResult: unknown): Response {
    const resultDto: ResultDTO<never, unknown> = {
      httpStatus: 200,
      success: true,
      payload: serviceResult,
    };
    return responseUtility.createJsonResponse(resultDto, 200);
  }

  protected getFailureResponse(err: BackendBaseErrors): Response {
    const resultDto: ResultDTO<BackendBaseErrors, never> = {
      httpStatus: STATUS_CODES[err.name] ?? 400,
      success: false,
      payload: err,
    };
    return responseUtility.createJsonResponse(resultDto, resultDto.httpStatus);
  }
}
