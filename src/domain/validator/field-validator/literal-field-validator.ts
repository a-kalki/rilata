import { success } from '../../../core/result/success.ts';
import { LiteralDataType } from '../rules/types.ts';
import { ValidationRule } from '../rules/validation-rule.ts';
import { CannotBeEmptyStringAssertionRule } from '../rules/assert-rules/cannot-be-empty-string.v-rule.ts';
import { CannotBeNullableAssertionRule } from '../rules/assert-rules/cannot-be-nullable.a-rule.ts';
import { CanBeNullableRule } from '../rules/nullable-rules/can-be-nullable.n-rule.ts';
import { FieldValidator } from './field-validator.ts';
import {
  FieldResult, GetArrayConfig, GetFieldValidatorDataType,
  LiteralFieldResult,
} from './types.js';

export class LiteralFieldValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  DATA_TYPE extends LiteralDataType
> extends FieldValidator<NAME, REQ, IS_ARR, DATA_TYPE> {
  constructor(
    attrName: NAME,
    isRequired: REQ,
    arrayConfig: GetArrayConfig<IS_ARR>,
    protected override dataType: GetFieldValidatorDataType<DATA_TYPE>,
    protected validateRules: ValidationRule<'validate', DATA_TYPE>[],
  ) {
    super(attrName, isRequired, arrayConfig, dataType);
  }

  override cloneWithName<NEW_NAME extends string>(
    newAttrName: NEW_NAME,
  ): LiteralFieldValidator<NEW_NAME, REQ, IS_ARR, DATA_TYPE> {
    return new LiteralFieldValidator(
      newAttrName, this.isRequired, this.arrayConfig, this.dataType, this.validateRules,
    );
  }

  override cloneWithRequired<R extends boolean>(
    newRequired: R,
  ): LiteralFieldValidator<NAME, R, IS_ARR, DATA_TYPE> {
    return new LiteralFieldValidator(
      this.attrName, newRequired, this.arrayConfig, this.dataType, this.validateRules,
    );
  }

  override cloneWithIsArray<A extends boolean>(
    newArrConfig: GetArrayConfig<A>,
  ): LiteralFieldValidator<NAME, REQ, A, DATA_TYPE> {
    return new LiteralFieldValidator(
      this.attrName, this.isRequired, newArrConfig, this.dataType, this.validateRules,
    );
  }

  override validate(value: unknown): LiteralFieldResult<IS_ARR> {
    return super.validate(value) as LiteralFieldResult<IS_ARR>;
  }

  protected validateValue(value: unknown): FieldResult {
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

    const validateAnswer = this.validateByRules(value, this.validateRules);
    return validateAnswer.isValidValue
      ? success(undefined)
      : this.getFailResult(validateAnswer.errors);
  }

  protected override getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
    if (this.dataType !== 'string') return super.getRequiredOrNullableRules();
    return this.isRequired
      ? [new CannotBeNullableAssertionRule(), new CannotBeEmptyStringAssertionRule()]
      : [new CanBeNullableRule()];
  }
}
