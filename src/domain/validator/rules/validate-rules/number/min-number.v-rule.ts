import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class MinNumberValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Число должно быть больше или равно {{min}}';

  constructor(private minNumber: number) {
    super();
  }

  validate(value: number): ValidationRuleAnswer {
    return value >= this.minNumber
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { min: this.minNumber });
  }
}
