import { ResultDTO } from '../../core/contract.ts';
import { BackendErrors, BadRequestError } from '../../core/errors.ts';
import { failure } from '../../core/result/failure.ts';
import { success } from '../../core/result/success.ts';
import { Result } from '../../core/result/types.ts';
import { ModuleMeta, RequestScope, Urls } from '../module/types.ts';
import { WebModule } from '../module/web.module.ts';
import { STATUS_CODES } from '../utils/response/constants.ts';
import { responseUtility } from '../utils/response/response-utility.ts';
import { Controller } from './controller.ts';
import { RilataRequest } from './types.ts';

export class WebModuleController implements Controller {
  constructor(protected module: WebModule<ModuleMeta>) {}

  getUrls(): Urls {
    return this.module.getUrls();
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
    const err = (ucResult as Result<BackendErrors, never>).value;
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
      const clone = req.clone();
      return success(await clone.json());
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

  protected getFailureResponse(err: BackendErrors): Response {
    const resultDto: ResultDTO<BackendErrors, never> = {
      httpStatus: STATUS_CODES[err.name] ?? 400,
      success: false,
      payload: err,
    };
    return responseUtility.createJsonResponse(resultDto, resultDto.httpStatus);
  }
}
