import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class MaxNumberValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Число должно быть меньше или равно {{max}}';

  constructor(private maxNumber: number) {
    super();
  }

  validate(value: number): ValidationRuleAnswer {
    return value <= this.maxNumber
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { max: this.maxNumber });
  }
}
