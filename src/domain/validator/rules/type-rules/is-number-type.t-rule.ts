import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class IsNumberTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть числовым';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return typeof value === 'number'
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
