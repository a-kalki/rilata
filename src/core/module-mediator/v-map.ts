import { LiteralFieldValidator } from "../../domain/validator/field-validator/literal-field-validator.ts";
import { ValidatorMap } from "../../domain/validator/field-validator/types.ts";
import { CannotBeEmptyStringValidationRule } from "../../domain/validator/rules/assert-rules/cannot-be-empty-string.a-rule.ts";
import { OwnerAggregateAttrs } from "./types.ts";

const cannotBeEmptyRule = new CannotBeEmptyStringValidationRule();

export const ownerArAttrsVmap: ValidatorMap<OwnerAggregateAttrs> = {
  ownerId: new LiteralFieldValidator('ownerId', true, { isArray: false }, 'string', [
    cannotBeEmptyRule,
  ]),
  ownerName: new LiteralFieldValidator('ownerName', true, { isArray: false }, 'string', [
    cannotBeEmptyRule,
  ]),
  context: new LiteralFieldValidator('context', true, { isArray: false }, 'string', [
    cannotBeEmptyRule,
  ]),
  access: new LiteralFieldValidator('access', true, { isArray: false }, 'string', [])
}
