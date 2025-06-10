import { validate } from 'email-validator';
import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class EmailFormatValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Строка не соответствует формату электронной почты';

  validate(value: string): ValidationRuleAnswer {
    return validate(value)
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
