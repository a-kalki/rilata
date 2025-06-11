import { uuidUtility } from '../api/utils/uuid/uuid-utility.ts';
import { Caller } from '../core/caller.ts';
import { GetArrayType } from '../core/type-functions.ts';
import { dtoUtility } from '../core/utils/dto/dto-utility.ts';
import { AggregateRoot } from './a-root.ts';
import { ARMeta, ArPublishEvent } from './meta-types.ts';

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
      aRootId: this.getId(),
      createdAt: Date.now(),
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
      throw Error(`not valid version for aggregate. arName: ${this.ar.name}; version: ${this.version}`);
    }
  }
}
