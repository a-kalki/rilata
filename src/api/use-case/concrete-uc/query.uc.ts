import { UCMeta } from '../../../core/app-meta.ts';
import { PermissionDeniedError, ValidationError, wholeValueValidationError } from '../../../core/errors.ts';
import { failure } from '../../../core/result/failure.ts';
import { success } from '../../../core/result/success.ts';
import { Result } from '../../../core/result/types.ts';
import { DtoFieldValidator } from '../../../domain/validator/field-validator/dto-field-validator.ts';
import { RequestScope, Resolvers } from '../../module/types.ts';
import { DomainResult, UcResult } from '../types.ts';
import { UseCase } from '../use-case.ts';

export abstract class QueryUseCase<R extends Resolvers, META extends UCMeta> extends UseCase {
  protected abstract supportAnonimousCall: boolean;

  declare protected moduleResolver: R['moduleResolver'];

  declare protected serverResolver: R['serverResolver'];

  abstract arName: META['aRoot']['name'];

  abstract name: META['name'];

  abstract inputName: META['in']['name'];

  protected abstract validator: DtoFieldValidator<
    META['in']['name'], true, false, META['in']['attrs']
  >;

  /** Выполнить сервис */
  async execute(input: META['in'], reqScope : RequestScope): Promise<UcResult<META>> {
    const checksResult = this.runInitialChecks(input, reqScope);
    if (checksResult.isFailure()) return checksResult;
    return this.executeService(input, reqScope);
  }

  /** Выполнить внутреннюю работу сервиса (БД, транзакции, доменого слоя) */
  protected async executeService(input: META['in'], requestScope: RequestScope): Promise<UcResult<META>> {
    return this.runDomain(input, requestScope);
  }

  /** Выполнить работу доменной логики */
  abstract runDomain(input: META['in'], reqScope: RequestScope): Promise<DomainResult<META>>

  /** Выполнить проверку разрешений пользователя и валидации */
  protected runInitialChecks(
    input: META['in'],
    reqScope: RequestScope,
  ): Result<ValidationError | PermissionDeniedError, undefined> {
    const checkCallerResult = this.checkCallerPermission(reqScope);
    if (checkCallerResult.isFailure()) return checkCallerResult;
    return this.checkValidations(input);
  }

  // eslint-disable-next-line max-len
  protected checkCallerPermission(reqScope: RequestScope): Result<PermissionDeniedError, undefined> {
    if (this.supportAnonimousCall) return success(undefined);
    if (reqScope.caller.type !== 'AnonymousUser') return success(undefined);
    return failure({
      name: 'Permission denied error',
      type: 'app-error',
    });
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
        type: 'app-error',
      };
      return failure(err);
    }
    return result;
  }
}
