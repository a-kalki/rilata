import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class IsArrayTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть массивом данных';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return Array.isArray(value)
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
