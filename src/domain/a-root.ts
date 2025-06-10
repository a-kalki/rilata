import { AssertionException } from '#core/exeptions.ts';
import { dtoUtility } from '#core/utils/dto/dto-utility.ts';
import { ARMeta } from '#domain/meta-types.ts';
import { AggregateRootHelper } from './a-root-helper.ts';
import { DtoFieldValidator } from './validator/field-validator/dto-field-validator.ts';

/** Корневой объект - т.е имеет уникальную глобальную идентификацию */
export abstract class AggregateRoot<META extends ARMeta> {
  protected helper: AggregateRootHelper<META>;

  /** Обычно используется для идентификации пользователем объекта в списке */
  abstract getShortName(): string

  abstract name: META['name'];

  constructor(
    protected attrs: META['attrs'],
    protected version: number,
    protected invariantsValidator: DtoFieldValidator<string, true, false, META['attrs']>,
  ) {
    this.helper = new AggregateRootHelper<META>(attrs, version, this);
    this.checkInveriants(invariantsValidator, attrs);
  }

  getId(): string {
    return this.helper.getId();
  }

  getAttrs(conf: { copy: boolean } = { copy: true }): META['attrs'] {
    return conf.copy ? dtoUtility.deepCopy(this.attrs) : this.attrs;
  }

  /** Обычно используется для логирования, например в ошибках. */
  toString(): string {
    return `${this.name} aggregate root: id-${this.getId()}`;
  }

  getHelper(): AggregateRootHelper<META> {
    return this.helper;
  }

  protected checkInveriants(
    invariantsValidator: DtoFieldValidator<string, true, false, META['attrs']>,
    attrs: META['attrs'],
  ): void {
    const invariantsResult = invariantsValidator.validate(attrs);
    if (invariantsResult.isFailure()) {
      const err = `не соблюдены инварианты агрегата ${this.constructor.name}`;
      const body = JSON.stringify({
        attrs: this.getAttrs(),
        validationResult: invariantsResult.value,
      });
      throw new AssertionException(`${err}\n\n${body}`);
    }
  }
}
