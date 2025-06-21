import { success } from '../../../../core/index.ts';
import { LiteralDataType } from '../../rules/types.ts';
import { LiteralFieldValidator } from '../literal-field-validator.ts';
import { FieldResult, LiteralFieldResult } from '../types.ts';

export class NotValidateFieldValidator<
  N extends string
> extends LiteralFieldValidator<N, boolean, boolean, LiteralDataType> {
  constructor(attrName: N) {
    super(attrName, false, { isArray: false }, 'boolean', []); // fake arguments
  }

  validate(value: unknown): LiteralFieldResult<boolean> {
    return success(undefined);
  }

  protected validateValue(value: unknown): FieldResult {
    throw new Error('Method not implemented.');
  }
}
