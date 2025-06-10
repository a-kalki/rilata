import { TypeOrAssertRuleAnswer } from '../types.ts';
import { ValidationRule } from '../validation-rule.ts';

export class CannotBeEmptyStringAssertionRule extends ValidationRule<'assert', string> {
  requirement = 'Строка обязательна к заполнению';

  validate(value: string): TypeOrAssertRuleAnswer {
    return value !== ''
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
