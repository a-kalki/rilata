import { domainStore } from '#core/store/domain-store.js';
import { ARMeta, ArPublishEventMeta } from '#domain/meta-types.ts';
import { dtoUtility } from '#core/utils/index.ts';
import { GetArrayType, Logger, RequestScope } from '#core/index.ts';
import { AggregateRoot } from './a-root.ts';

/** Класс помощник агрегата. Забирает себе всю техническую работу агрегата,
    позволяя агрегату сосредоточиться на решении логики предметного уровня. */
export class AggregateRootHelper<META extends ARMeta> {
  private events: ArPublishEventMeta[] = [];

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

  getLogger(): Logger {
    return domainStore.getPayload().logger;
  }

  getOutput(copy = true): META['attrs'] {
    return copy ? dtoUtility.deepCopy(this.attrs) : this.attrs;
  }

  registerEvent<EVENTS extends GetArrayType<META['events']>>(
    name: EVENTS['name'],
    attrs: EVENTS['attrs'],
    reqScope: RequestScope,
  ): void {
    const event: ArPublishEventMeta = {
      name,
      attrs: {
        aRoot: this.getOutput(),
        event: attrs,
      },
      requestData: {
        requestId: reqScope.requestId,
        caller: reqScope.caller,
      },
      aRootName: this.getName(),
      aRootVersion: this.getVersion(),
    };
    this.events.push(event);
  }

  getEvents(): ArPublishEventMeta[] {
    return this.events;
  }

  cleanEvents(): void {
    this.events = [];
  }

  private validateVersion(): void {
    if (typeof this.version !== 'number' || this.version < 0) {
      throw this.getLogger().error(
        `not valid version for aggregate ${this.aRootName}`,
        { aRootName: this.aRootName, version: this.version },
      );
    }
  }
}
