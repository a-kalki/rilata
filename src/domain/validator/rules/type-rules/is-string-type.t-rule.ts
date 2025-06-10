import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class IsStringTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть строковым значением';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return typeof value === 'string'
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
