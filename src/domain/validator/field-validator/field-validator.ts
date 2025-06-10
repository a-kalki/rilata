import { DTO } from '#core/types.ts';
import { failure } from '../../../core/result/failure.ts';
import { success } from '../../../core/result/success.ts';
import { AssertionException } from '../../../core/exeptions.ts';
import { CannotBeEmptyArrayAssertionRule } from '../rules/assert-rules/cannot-be-empty-array.a-rule.ts';
import { CannotBeNullableAssertionRule } from '../rules/assert-rules/cannot-be-nullable.a-rule.ts';
import { MaxArrayElementsCountAssertionRule } from '../rules/assert-rules/max-array-elements-count.a-rule.ts';
import { MinArrayElementsCountAssertionRule } from '../rules/assert-rules/min-array-elements-count.a-rule.ts';
import { CanBeNullableRule } from '../rules/nullable-rules/can-be-nullable.n-rule.ts';
import { IsArrayTypeRule } from '../rules/type-rules/is-array-type.t-rule.ts';
import { IsBooleanTypeRule } from '../rules/type-rules/is-boolean-type.t-rule.ts';
import { IsDTOTypeRule } from '../rules/type-rules/is-dto-type.t-rule.ts';
import { IsNumberTypeRule } from '../rules/type-rules/is-number-type.t-rule.ts';
import { IsStringTypeRule } from '../rules/type-rules/is-string-type.t-rule.ts';
import { GeneralValidationRule, LiteralDataType, RuleError } from '../rules/types.ts';
import { ValidationRule } from '../rules/validation-rule.ts';
import { CannotBeInfinityRule } from '../rules/assert-rules/cannot-be-infinity.a-rule.ts';
import { CannotBeNanRule } from '../rules/assert-rules/cannot-be-nan.a-rule.ts';
import {
  GetArrayConfig, GetFieldValidatorDataType,
  RulesValidatedAnswer, RuleErrors, FieldResult, FullFieldResult,
  ArrayFieldResult, ArrayFieldErrors, FieldErrors,
} from './types.js';

export abstract class FieldValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  DATA_TYPE extends LiteralDataType | DTO
> {
  static ARRAY_WHOLE_VALUE_VALIDATION_ERROR_KEY = '___array_whole_value_validation_error___';

  protected abstract validateValue(value: unknown): FieldResult

  constructor(
    protected attrName: NAME,
    public isRequired: REQ,
    protected arrayConfig: GetArrayConfig<IS_ARR>,
    protected dataType: GetFieldValidatorDataType<DATA_TYPE>,
  ) {
    if (arrayConfig.isArray) {
      const [min, max] = [arrayConfig.minElementsCount, arrayConfig.maxElementsCount];
      if (
        (min !== undefined && min < 0)
        || (max !== undefined && max < 0)
        || (
          min !== undefined && max !== undefined && min > max
        )
      ) this.throwError(`not valid arrayConfig: min=${min}, max=${max}`);
    }
  }

  validate(value: unknown): FullFieldResult {
    const validationResult = this.arrayConfig.isArray
      ? this.validateArray(value)
      : this.validateValue(value);
    if (validationResult.isSuccess()) {
      return this.complexValidate(value);
    }
    return validationResult;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected complexValidate(value: unknown): FullFieldResult {
    return success(undefined);
  }

  /** проверка массива данных */
  protected validateArray(unknownValue: unknown): ArrayFieldResult {
    const nullableAnswer = this.validateNullableValue(unknownValue);
    if (nullableAnswer.break) {
      return nullableAnswer.isValidValue
        ? success(undefined)
        : this.getArrayFailResult(nullableAnswer.errors);
    }

    const arrayAssertAnswer = this.validateByRules(unknownValue, this.getArrayAssertionRules());
    if (arrayAssertAnswer.isValidValue === false) {
      return failure(
        { [FieldValidator.ARRAY_WHOLE_VALUE_VALIDATION_ERROR_KEY]: arrayAssertAnswer.errors },
      );
    }

    if (Array.isArray(unknownValue) === false) {
      this.throwError('array assertion rules not missed a mistake');
    }
    const values = unknownValue as unknown[];
    const arrErrors: ArrayFieldErrors = {};
    for (let i = 0; i < values.length; i += 1) {
      const itemResult = this.validateValue(values[i]);
      if (itemResult.isFailure()) {
        arrErrors[i] = itemResult.value;
      }
    }

    return Object.keys(arrErrors).length > 0
      ? failure(arrErrors)
      : success(undefined);
  }

  /** предварительные проверки на нулевое значение (undefined, null) */
  protected validateNullableValue(value: unknown): RulesValidatedAnswer {
    return this.validateByRules(value, this.getRequiredOrNullableRules());
  }

  protected getRequiredOrNullableRules(): Array<ValidationRule<'assert', unknown> | ValidationRule<'nullable', unknown>> {
    return this.isRequired
      ? [new CannotBeNullableAssertionRule()]
      : [new CanBeNullableRule()];
  }

  protected getTypeCheckRules(): ValidationRule<'type', unknown>[] {
    if (this.dataType === 'dto') return [new IsDTOTypeRule()];
    if (this.dataType === 'number') return [new IsNumberTypeRule(), new CannotBeInfinityRule(), new CannotBeNanRule()];
    if (this.dataType === 'boolean') return [new IsBooleanTypeRule()];
    return [new IsStringTypeRule()];
  }

  /** возвращает правила проверки типов и утверждений для массива */
  protected getArrayAssertionRules(): ValidationRule<'assert', unknown>[] {
    if (!this.arrayConfig.isArray) this.throwError('wrong call this method');
    const assertionRules = [new IsArrayTypeRule()];
    if (this.arrayConfig.mustBeFilled) assertionRules.push(new CannotBeEmptyArrayAssertionRule());
    if (this.arrayConfig.maxElementsCount !== undefined) {
      assertionRules.push(new MaxArrayElementsCountAssertionRule(
        this.arrayConfig.maxElementsCount,
      ));
    }
    if (this.arrayConfig.minElementsCount !== undefined) {
      assertionRules.push(new MinArrayElementsCountAssertionRule(
        this.arrayConfig.minElementsCount,
      ));
    }
    return assertionRules;
  }

  /** проверяет значение на соответствие правил */
  protected validateByRules(
    value: unknown,
    rules: GeneralValidationRule[],
  ): RulesValidatedAnswer {
    const errors: RuleError[] = [];
    let shouldBreak = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const rule of rules) {
      const result = rule.validate(value);
      const { behaviour } = result;

      if (behaviour === 'SuccessBreakValidation') {
        shouldBreak = true;
      } else if (behaviour === 'SaveErrorAndRunNextRule') {
        errors.push(result.ruleError);
      } else if (behaviour === 'SaveErrorAndBreakValidation') {
        errors.push(result.ruleError);
        shouldBreak = true;
      }
      if (shouldBreak) break;
    }

    return errors.length > 0
      ? { isValidValue: false, errors, break: shouldBreak }
      : { isValidValue: true, break: shouldBreak };
  }

  protected getFailResult(errors: RuleErrors | FieldErrors): FieldResult {
    return failure({ [this.attrName]: errors });
  }

  protected getArrayFailResult(errors: RuleErrors | FieldErrors): FieldResult {
    return failure({ [FieldValidator.ARRAY_WHOLE_VALUE_VALIDATION_ERROR_KEY]: errors });
  }

  protected throwError(errStr: string): never {
    throw new AssertionException(errStr);
  }
}
