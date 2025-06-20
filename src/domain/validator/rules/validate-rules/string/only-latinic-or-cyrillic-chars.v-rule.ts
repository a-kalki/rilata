import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class OnlyLitinicOrCyrillicCharsValidationRule extends ValidationRule <'validate', string> {
  requirement = 'Строка может содержать слова только на латинице или на кирилице.';

  private latinic = /^[ a-z]+$/i;

  private cyrillic = /^[ а-яё]+$/i;

  validate(value: string): ValidationRuleAnswer {
    return this.latinic.test(value) || this.cyrillic.test(value)
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
