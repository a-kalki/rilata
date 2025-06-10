import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class CannotBeInfinityRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не может быть Infinity или -Infinity';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return value !== Infinity && value !== -Infinity
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
