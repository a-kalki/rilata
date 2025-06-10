import { ValidationRule } from '../validation-rule.ts';
import { EmptyValueRuleAnswer } from '../types.ts';

export class CanBeNullValidationRule extends ValidationRule<'nullable', unknown> {
  requirement = 'Значение может быть равным null';

  validate(value: unknown): EmptyValueRuleAnswer {
    return value === null
      ? this.returnSuccess('SuccessBreakValidation')
      : this.returnSuccess('SuccessRunNextRule');
  }
}
