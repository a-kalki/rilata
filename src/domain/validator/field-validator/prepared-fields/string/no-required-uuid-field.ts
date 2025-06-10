import { UUIDFormatValidationRule } from '../../../rules/validate-rules/string/uuid-format.v-rule.ts';
import { LiteralFieldValidator } from '../../literal-field-validator.ts';

export class NoRequiredUuidField<N extends string>
  extends LiteralFieldValidator<N, false, false, string> {
  constructor(attrName: N) {
    super(
      attrName,
      false,
      { isArray: false },
      'string',
      [new UUIDFormatValidationRule()],
    );
  }
}
