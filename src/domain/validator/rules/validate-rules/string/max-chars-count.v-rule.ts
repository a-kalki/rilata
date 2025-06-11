import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class MaxCharsCountValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Длина строки должна быть не больше {{maxCount}}';

  constructor(private maxCharsCount: number) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    return value.length > this.maxCharsCount
      ? this.returnFail('SaveErrorAndRunNextRule', { maxCount: this.maxCharsCount })
      : this.returnSuccess('SuccessRunNextRule');
  }
}
