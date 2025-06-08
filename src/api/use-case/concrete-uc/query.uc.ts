import { RequestScope } from '#core/request-data.ts';
import { failure } from '#core/result/failure.ts';
import { success } from '#core/result/success.ts';
import { Result } from '#core/result/types.ts';
import { MaybePromise } from '#core/types.ts';
import { DtoFieldValidator } from '#domain/validator/field-validator/dto-field-validator.ts';
import { ValidationError } from '../app-error-types.ts';
import { authPermissionDeniedError, permissionDeniedError, wholeValueValidationError } from '../errors.ts';
import { QueryUCMeta, RunDomainResult, ServiceResult } from '../types.js';
import { Service } from '../uc.ts';

export abstract class QueryService<META extends QueryUCMeta> extends Service<META> {
  protected supportAnonimousCall = false;

  protected abstract validator: DtoFieldValidator<
    'attrs', false, false, META['in']['attrs']
  >;

  /** Выполнить сервис */
  async execute(input: META['in'], reqScope : RequestScope): Promise<ServiceResult<META>> {
    const checksResult = this.runInitialChecks(input, reqScope);
    if (checksResult.isFailure()) return checksResult;
    return this.executeService(input, reqScope);
  }

  /** Выполнить внутреннюю работу сервиса (БД, транзакции, доменого слоя) */
  protected async executeService(input: META['in'], requestScope: RequestScope): Promise<ServiceResult<META>> {
    return this.runDomain(input, requestScope);
  }

  /** Выполнить работу доменной логики */
  abstract runDomain(input: META['in'], requestData: RequestScope): MaybePromise<RunDomainResult<META>>

  /** Выполнить проверку разрешений пользователя и валидации */
  protected runInitialChecks(
    input: META['in'],
    reqScope: RequestScope,
  ): Result<ValidationError | typeof permissionDeniedError, undefined> {
    const checkCallerResult = this.checkCallerPermission(reqScope);
    if (checkCallerResult.isFailure()) return checkCallerResult;
    return this.checkValidations(input);
  }

  // eslint-disable-next-line max-len
  protected checkCallerPermission(reqScope: RequestScope): Result<typeof authPermissionDeniedError, undefined> {
    if (this.supportAnonimousCall) return success(undefined);
    if (reqScope.caller.type !== 'AnonymousUser') return success(undefined);
    return failure(authPermissionDeniedError);
  }

  protected checkValidations(
    input: META['in'],
  ): Result<ValidationError, undefined> {
    if (input.attrs === undefined) {
      this.logger.error('validate implemented only requestDod and eventDod');
      return failure(wholeValueValidationError);
    }
    const result = this.validator.validate(input.attrs);

    if (result.isFailure()) {
      const err: ValidationError = {
        errors: result.value,
        name: 'Validation error',
        errorType: 'app-error',
      };
      return failure(err);
    }
    return result;
  }
}
