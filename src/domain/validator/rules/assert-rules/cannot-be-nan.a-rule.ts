import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class CannotBeNanRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не может быть NaN';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return isNaN(Number(value))
      ? this.returnFail('SaveErrorAndBreakValidation')
      : this.returnSuccess('SuccessRunNextRule');
  }
}
