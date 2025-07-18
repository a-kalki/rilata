/* eslint-disable camelcase */
import { failure } from '../../../core/result/failure.ts';
import { success } from '../../../core/result/success.ts';
import { DTO } from '../../../core/types.ts';
import { FieldValidator } from './field-validator.ts';
import {
  ArrayFieldErrors, FieldErrors, FullFieldResult, GetArrayConfig,
  GetFieldValidatorDataType, RuleErrors, ValidatorMap,
} from './types.js';

export class DtoFieldValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  DTO_TYPE extends DTO
> extends FieldValidator<NAME, REQ, IS_ARR, DTO_TYPE> {
  static DTO_WHOLE_VALUE_VALIDATION_ERROR_KEY = '___dto_whole_value_validation_error___';

  constructor(
    attrName: NAME,
    required: REQ,
    arrayConfig: GetArrayConfig<IS_ARR>,
    dataType: GetFieldValidatorDataType<DTO_TYPE>,
    protected dtoMap: ValidatorMap<DTO_TYPE>,
  ) {
    super(attrName, required, arrayConfig, dataType);
  }

  override cloneWithName<NEW_NAME extends string>(
    newAttrName: NEW_NAME,
  ): DtoFieldValidator<NEW_NAME, REQ, IS_ARR, DTO_TYPE> {
    return super.cloneWithName(
      newAttrName,
    ) as DtoFieldValidator<NEW_NAME, REQ, IS_ARR, DTO_TYPE>;
  }

  override cloneWithRequired<R extends boolean>(
    newRequired: R,
  ): DtoFieldValidator<NAME, R, IS_ARR, DTO_TYPE> {
    return super.cloneWithRequired(
      newRequired,
    ) as DtoFieldValidator<NAME, R, IS_ARR, DTO_TYPE>;
  }

  override cloneWithIsArray<A extends boolean>(
    newArrConfig: GetArrayConfig<A>,
  ): DtoFieldValidator<NAME, REQ, A, DTO_TYPE> {
    return super.cloneWithIsArray(newArrConfig) as DtoFieldValidator<NAME, REQ, A, DTO_TYPE>;
  }

  protected getCloneExtraArgs(): unknown[] {
    return [this.dtoMap];
  }

  protected validateValue(value: unknown): FullFieldResult {
    if (this.arrayConfig.isArray === false) {
      const nullableAnswer = this.validateNullableValue(value);
      if (nullableAnswer.break) {
        return nullableAnswer.isValidValue
          ? success(undefined)
          : this.getFailResult(nullableAnswer.errors);
      }
    }

    const typeAnswer = this.validateByRules(value, this.getTypeCheckRules());
    if (typeAnswer.isValidValue === false) return this.getFailResult(typeAnswer.errors);

    const errors = this.validateDtoMap(value as Record<string, unknown>);
    return Object.keys(errors).length > 0
      ? super.getFailResult(errors)
      : success(undefined);
  }

  protected validateDtoMap(value: Record<string, unknown>): FieldErrors | ArrayFieldErrors {
    let errors: FieldErrors | ArrayFieldErrors = {};
    Object.entries(this.dtoMap).forEach(([dtoAttrName, validator]) => {
      if (validator instanceof FieldValidator) {
        const result = validator.validate((value as DTO_TYPE)[dtoAttrName]);
        if (result.isFailure()) {
          errors = (
            { ...errors, ...result.value }
          );
        }
      }
    });
    return errors;
  }

  protected override getFailResult(errors: FieldErrors | RuleErrors): FullFieldResult {
    return failure({ [DtoFieldValidator.DTO_WHOLE_VALUE_VALIDATION_ERROR_KEY]: errors });
  }
}
