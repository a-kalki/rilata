import { RuleType } from '../../../rules/types.ts';
import { ValidationRule } from '../../../rules/validation-rule.ts';
import { DtoFieldValidator } from '../../dto-field-validator.ts';
import { ArrayFieldErrors, FieldErrors, GetArrayConfig } from '../../types.ts';

/** Используется, когда заранее не известно имя атрибутов,
т.е. и имя и значение вводятся пользователем.
  Проверяются только значения, если нужно проверить и ключи, то сделать это отдельно.
  */
export class RecordDtoValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  TYPE extends Record<string, unknown>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
> extends DtoFieldValidator<NAME, REQ, IS_ARR, TYPE> {
  constructor(
    required: REQ,
    isArray: GetArrayConfig<IS_ARR>,
    protected valueValidatorRules: ValidationRule<RuleType, unknown>[],
  ) {
    // @ts-expect-error
    super('_', required, isArray, 'dto', {});
  }

  protected validateDtoMap(record: Record<string, unknown>): FieldErrors | ArrayFieldErrors {
    const errors: FieldErrors | ArrayFieldErrors = {};
    Object.entries(record).forEach(([key, value]) => {
      const valueValidatorAnswer = this.validateByRules(value, this.valueValidatorRules);
      if (valueValidatorAnswer.isValidValue === false) {
        // @ts-expect-error
        errors[key] = valueValidatorAnswer.errors;
      }
    });
    return errors;
  }
}
