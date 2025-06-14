import { uuidUtility } from '../api/utils/uuid/uuid-utility.ts';
import { Caller } from '../core/caller.ts';
import { dtoUtility } from '../core/utils/dto/dto-utility.ts';
import { AggregateRoot } from './a-root.ts';
import { ARMeta, ArPublishEvent } from './meta-types.ts';

/** Класс помощник агрегата. Забирает себе всю техническую работу агрегата,
    позволяя агрегату сосредоточиться на решении логики предметного уровня. */
export class AggregateRootHelper<META extends ARMeta> {
  private events: ArPublishEvent[] = [];

  private version: number;

  constructor(
    protected attrs: META['attrs'],
    protected aRoot: AggregateRoot<META>,
  ) {
    this.version = 0;
  }

  setVersion(version: number): void {
    this.version = version;
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

  registerEvent<EVENT extends META['events']>(
    name: EVENT['name'],
    attrs: EVENT['attrs'],
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
      aRootName: this.aRoot.name,
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
      throw Error(`not valid version for aggregate. arName: ${this.aRoot.name}; version: ${this.version}`);
    }
  }
}
