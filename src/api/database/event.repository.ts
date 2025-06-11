import { MaybePromise, UuidType } from '../../core/types.ts';
import { ArPublishEvent } from '../../domain/meta-types.ts';

export interface EventRepository {
  addEvents(event: ArPublishEvent[]): MaybePromise<unknown>

  findEvent(id: UuidType): MaybePromise<unknown>

  isExist(id: UuidType): MaybePromise<boolean>

  getAggregateEvents(aRootId: UuidType): MaybePromise<ArPublishEvent[]>
}
