import { LiteralFieldValidator } from "../../domain/validator/field-validator/literal-field-validator.ts";
import { ValidatorMap } from "../../domain/validator/field-validator/types.ts";
import { CannotBeEmptyStringValidationRule } from "../../domain/validator/rules/assert-rules/cannot-be-empty-string.a-rule.ts";
import { OwnerAggregateAttrs } from "./types.ts";

export const ownerArAttrsVmap: ValidatorMap<OwnerAggregateAttrs> = {
  ownerId: new LiteralFieldValidator('ownerId', true, { isArray: false }, 'string', [
    new CannotBeEmptyStringValidationRule(),
  ]),
  ownerName: new LiteralFieldValidator('ownerName', true, { isArray: false }, 'string', [
    new CannotBeEmptyStringValidationRule(),
  ]),
  context: new LiteralFieldValidator('context', true, { isArray: false }, 'string', [
    new CannotBeEmptyStringValidationRule(),
  ]),
  access: new LiteralFieldValidator('access', true, { isArray: false }, 'string', [])
}
