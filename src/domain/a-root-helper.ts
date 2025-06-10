import { ARMeta, ArPublishEvent } from '#domain/meta-types.ts';
import { dtoUtility } from '#core/utils/index.ts';
import { AggregateRoot } from './a-root.ts';
import { Logger } from '#api/logger/logger.ts';
import { GetArrayType } from '#core/type-functions.ts';
import { Caller } from '#core/caller.ts';
import { uuidUtility } from '#api/utils/uuid/uuid-utility.ts';

/** Класс помощник агрегата. Забирает себе всю техническую работу агрегата,
    позволяя агрегату сосредоточиться на решении логики предметного уровня. */
export class AggregateRootHelper<META extends ARMeta> {
  private events: ArPublishEvent[] = [];

  constructor(
    protected attrs: META['attrs'],
    protected version: number,
    protected ar: AggregateRoot<META>,
  ) {
    this.validateVersion();
  }

  getVersion(): number {
    return this.version;
  }

  getId(): string {
    return this.attrs.id;
  }

  getOutput(copy = true): META['attrs'] {
    return copy ? dtoUtility.deepCopy(this.attrs) : this.attrs;
  }

  registerEvent<EVENTS extends GetArrayType<META['events']>>(
    name: EVENTS['name'],
    attrs: EVENTS['attrs'],
    requestId: string,
    caller: Caller,
  ): void {
    const event: ArPublishEvent = {
      id: uuidUtility.getNewUuidV7(),
      name,
      attrs: {
        aRoot: this.getOutput(),
        event: attrs,
      },
      caller,
      requestId,
      aRootName: this.ar.name,
      aRootVersion: this.getVersion(),
    };
    this.events.push(event);
  }

  getEvents(): ArPublishEvent[] {
    return this.events;
  }

  cleanEvents(): void {
    this.events = [];
  }

  private validateVersion(): void {
    if (typeof this.version !== 'number' || this.version < 0) {
      throw this.getLogger().error(
        `not valid version for aggregate ${this.ar.name}`,
        { aRootName: this.ar.name, version: this.version },
      );
    }
  }
}
