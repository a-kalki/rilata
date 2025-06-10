import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class IsBooleanTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть булевым';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return typeof value === 'boolean'
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
