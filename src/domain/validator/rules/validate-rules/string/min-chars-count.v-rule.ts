import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class MinCharsCountValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Строка должна быть не меньше {{minCount}}';

  constructor(private minCharsCount: number, requirement?: string) {
    super();
    if (requirement) this.requirement = requirement;
  }

  validate(value: string): ValidationRuleAnswer {
    return value.length < this.minCharsCount
      ? this.returnFail('SaveErrorAndRunNextRule', { minCount: this.minCharsCount })
      : this.returnSuccess('SuccessRunNextRule');
  }
}
