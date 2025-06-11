import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class CannotBeEmptyArrayAssertionRule extends ValidationRule<'assert', unknown> {
  requirement = 'Значение должно быть не пустым массивом данных';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return Array.isArray(value) && value.length > 0
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
