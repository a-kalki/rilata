import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class CannotBeUndefinedValidationRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение не должно быть undefined';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return value !== undefined
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
