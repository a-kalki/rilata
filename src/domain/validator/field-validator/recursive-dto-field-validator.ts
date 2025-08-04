import { DTO } from "../../../core/types.ts";
import { DtoFieldValidator } from "./dto-field-validator.ts"
import { GetArrayConfig, GetFieldValidatorDataType, ValidatorMap } from "./types.ts";

export class RecursiveDtoFieldValidator<
  NAME extends string,
  REQ extends boolean,
  IS_ARR extends boolean,
  DTO_TYPE extends DTO
> extends DtoFieldValidator<NAME, REQ, IS_ARR, DTO_TYPE> {
  constructor(
    attrName: NAME,
    required: REQ,
    arrayConfig: GetArrayConfig<IS_ARR>,
    dataType: GetFieldValidatorDataType<DTO_TYPE>,
    dtoMapResolver: () => ValidatorMap<DTO_TYPE>,
  ) {
      super(attrName, required, arrayConfig, dataType, dtoMapResolver());
    }
}
