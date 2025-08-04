export * from './constants.ts';
export type { RuleError, LiteralDataType } from './rules/types.ts';
export type {
  RuleErrors, ValidatorMap, FieldErrors, ArrayFieldErrors,
  GeneralDtoFieldValidator, GeneralLiteralFieldValidator, LiteralFieldErrors, ArrayLiteralFieldErrors
} from './field-validator/types.js';
export * from './field-validator/field-validator.ts';
export * from './field-validator/literal-field-validator.ts';
export * from './field-validator/dto-field-validator.ts';
export * from './field-validator/recursive-dto-field-validator.ts';
export * from './rules/validation-rule.ts';

// +++++++++++++++ Prepared Field Validators ++++++++++++++++=
export * from './field-validator/prepared-fields/dto/record.ts';
export * from './field-validator/prepared-fields/not-validate-field.ts';
export * from './field-validator/prepared-fields/string/uuid-field.ts';
export * from './field-validator/prepared-fields/string/cannot-empty-string.ts';
export * from './field-validator/prepared-fields/string/choice.ts';
export * from './field-validator/prepared-fields/string/no-required-uuid-field.ts';
export * from './field-validator/prepared-fields/string/strict-equal.ts';

// +++++++++++++++ Prepared Validator Rules ++++++++++++++++=
// string rules
export * from './rules/validate-rules/string/contained-only-chars.v-rule.ts';
export * from './rules/validate-rules/string/email-format.field-v-rule.ts';
export * from './rules/validate-rules/string/equal-chars-count.v-rule.ts';
export * from './rules/validate-rules/string/max-chars-count.v-rule.ts';
export * from './rules/validate-rules/string/min-chars-count.v-rule.ts';
export * from './rules/validate-rules/string/no-contained-chars.v-rule.ts';
export * from './rules/validate-rules/string/no-contained-space.v-rule.ts';
export * from './rules/validate-rules/string/only-dash-and-latinic-or-cyrillic-chars.v-rule.ts';
export * from './rules/validate-rules/string/only-latinic-or-cyrillic-chars.v-rule.ts';
export * from './rules/validate-rules/string/regex-doesnt-match-value.field-v-rule.ts';
export * from './rules/validate-rules/string/regex-matches-value.field-v-rule.ts';
export * from './rules/validate-rules/string/string-choice.v-rule.ts';
export * from './rules/validate-rules/string/text-strict-equal.v-rule.ts';
export * from './rules/validate-rules/string/uuid-format.v-rule.ts';

// number rules
export * from './rules/validate-rules/number/max-number.v-rule.ts';
export * from './rules/validate-rules/number/min-number.v-rule.ts';
export * from './rules/validate-rules/number/positive-number.v-rule.ts';
export * from './rules/validate-rules/number/range-number.v-rule.ts';

// timestamp rules
export * from './rules/validate-rules/timestamp/is-timestamp.v-rule.ts';
export * from './rules/validate-rules/timestamp/max-data.v-rule.ts';
export * from './rules/validate-rules/timestamp/min-data.v-rule.ts';
export * from './rules/validate-rules/timestamp/range-data.v-rule.ts';

// type rules
export * from './rules/type-rules/is-array-type.t-rule.ts';
export * from './rules/type-rules/is-boolean-type.t-rule.ts';
export * from './rules/type-rules/is-dto-type.t-rule.ts';
export * from './rules/type-rules/is-number-type.t-rule.ts';
export * from './rules/type-rules/is-string-type.t-rule.ts';

// nullable-rules
export * from './rules/nullable-rules/can-be-nullable.n-rule.ts';
export * from './rules/nullable-rules/can-be-only-null.n-rule.ts';
export * from './rules/nullable-rules/can-be-only-undefined.n-rule.ts';

// assert-rules
export * from './rules/assert-rules/cannot-be-empty-array.a-rule.ts';
export * from './rules/assert-rules/cannot-be-empty-string.a-rule.ts';
export * from './rules/assert-rules/cannot-be-infinity.a-rule.ts';
export * from './rules/assert-rules/cannot-be-nan.a-rule.ts';
export * from './rules/assert-rules/cannot-be-null.a-rule.ts';
export * from './rules/assert-rules/cannot-be-nullable.a-rule.ts';
export * from './rules/assert-rules/cannot-be-undefined.a-rule.ts';
export * from './rules/assert-rules/max-array-elements-count.a-rule.ts';
export * from './rules/assert-rules/min-array-elements-count.a-rule.ts';
