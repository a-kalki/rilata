import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class RegexDoesntMatchValidationRule extends ValidationRule<'validate', string> {
  constructor(protected regex: RegExp, public requirement: string, private hint = {}) {
    super();
  }

  validate(value: string): ValidationRuleAnswer {
    return this.regex.test(value)
      ? this.returnFail('SaveErrorAndRunNextRule', this.hint)
      : this.returnSuccess('SuccessRunNextRule');
  }
}
