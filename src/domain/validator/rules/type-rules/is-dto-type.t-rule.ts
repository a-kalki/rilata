import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';

export class IsDTOTypeRule extends ValidationRule<'type', unknown> {
  requirement = 'Значение должно быть объектом';

  validate(value: unknown): TypeOrAssertRuleAnswer {
    return (
      typeof value === 'object'
      && Array.isArray(value) === false
      && value !== null
    )
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndBreakValidation');
  }
}
