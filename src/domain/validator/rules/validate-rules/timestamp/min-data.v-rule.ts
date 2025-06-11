import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class MinDateStampValidationRule extends ValidationRule<'validate', number> {
  requirement = 'Дата должно быть позже {{minDate}}';

  private minDateAsTimestamp: number;

  constructor(minDate: Date) {
    super();
    this.minDateAsTimestamp = minDate.getTime();
  }

  validate(value: number): ValidationRuleAnswer {
    return value >= this.minDateAsTimestamp
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule', { minDate: this.minDateAsTimestamp });
  }
}
