import { uuidUtility } from '../../../../../api/utils/uuid/uuid-utility.ts';
import { ValidationRuleAnswer } from '../../types.ts';
import { ValidationRule } from '../../validation-rule.ts';

export class UUIDFormatValidationRule extends ValidationRule<'validate', string> {
  requirement = 'Значение должно соответствовать формату UUID';

  validate(value: string): ValidationRuleAnswer {
    return uuidUtility.isValidValue(value)
      ? this.returnSuccess('SuccessRunNextRule')
      : this.returnFail('SaveErrorAndRunNextRule');
  }
}
