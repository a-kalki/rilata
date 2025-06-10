import { UUIDFormatValidationRule } from '../../../rules/validate-rules/string/uuid-format.v-rule.ts';
import { LiteralFieldValidator } from '../../literal-field-validator.ts';

export class UuidField<N extends string> extends LiteralFieldValidator<N, true, false, string> {
  constructor(attrName: N) {
    super(
      attrName,
      true,
      { isArray: false },
      'string',
      [new UUIDFormatValidationRule()],
    );
  }
}
