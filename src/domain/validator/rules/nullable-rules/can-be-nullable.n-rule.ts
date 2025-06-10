import { ValidationRule } from '../validation-rule.ts';
import { EmptyValueRuleAnswer } from '../types.ts';

export class CanBeNullableRule extends ValidationRule<'nullable', unknown> {
  requirement = 'Значение может быть равным undefined или null';

  validate(value: unknown): EmptyValueRuleAnswer {
    return (value === undefined || value === null)
      ? this.returnSuccess('SuccessBreakValidation')
      : this.returnSuccess('SuccessRunNextRule');
  }
}
