import { StringChoiceValidationRule } from '../../../rules/validate-rules/string/string-choice.v-rule.ts';
import { LiteralFieldValidator } from '../../literal-field-validator.ts';
import { GetArrayConfig } from '../../types.ts';

export class StringChoiceFieldValidator<
  NAME extends string, REQ extends boolean, IS_ARR extends boolean
> extends LiteralFieldValidator<NAME, REQ, IS_ARR, string> {
  constructor(
    attrName: NAME,
    required: REQ,
    isArray: GetArrayConfig<IS_ARR>,
    choice: Array<string> | ReadonlyArray<string>,
  ) {
    super(attrName, required, isArray, 'string', [new StringChoiceValidationRule(choice)]);
  }
}
