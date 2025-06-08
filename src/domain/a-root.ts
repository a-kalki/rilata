import { dtoUtility } from '#core/utils/index.ts';
import { ARMeta } from '#domain/meta-types.ts';
import { AggregateRootHelper } from './a-root-helper.ts';
import { DtoFieldValidator } from './validator/index.ts';

/** Корневой объект - т.е имеет уникальную глобальную идентификацию */
export abstract class AggregateRoot<META extends ARMeta> {
  protected helper: AggregateRootHelper<META>;

  /** Обычно используется для идентификации пользователем объекта в списке */
  abstract getShortName(): string

  abstract name: META['name'];

  abstract invariantsValidator: DtoFieldValidator<string, true, false, META['attrs']>;

  constructor(
    protected attrs: META['attrs'],
    version: number,
  ) {
    this.helper = new AggregateRootHelper<META>(attrs, version, this);
    this.checkInveriants(attrs);
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
    attrs: META['attrs'],
  ): void {
    const invariantsResult = this.invariantsValidator.validate(attrs);
    if (invariantsResult.isFailure()) {
      throw this.getHelper().getLogger().error(`не соблюдены инварианты агрегата ${this.constructor.name}`, {
        modelAttrs: attrs,
        validatorValue: invariantsResult.value,
      });
    }
  }
}
