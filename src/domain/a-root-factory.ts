import { DTO } from '../core/types.ts';
import { AggregateRoot } from './a-root.ts';
import { ARMeta } from './meta-types.ts';

export abstract class AggregateFactory<PARAMS extends ARMeta> {
  /** создать экземпляр агрегата по событию */
  abstract create(command: DTO, ...attrs: unknown[]): AggregateRoot<PARAMS>

  /** восстановить эксемпляр агрегата по атрибутам */
  abstract restore(...args: unknown[]): AggregateRoot<PARAMS>
}
