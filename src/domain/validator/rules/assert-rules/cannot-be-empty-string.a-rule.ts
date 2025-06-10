import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class CannotBeEmptyStringValidationRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение должно быть не пустой строкой';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return typeof value === 'string' && value !== ''
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
