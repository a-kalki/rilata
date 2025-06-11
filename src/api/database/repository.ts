import { MaybePromise } from '../../core/types.ts';
import { DatabaseServiceStatus } from './types.ts';

export interface Repository<
  T_NAME extends string,
  REC extends Record<string, unknown>
> {
  tableName: T_NAME

  isCreated(): MaybePromise<boolean>

  create(): MaybePromise<unknown>

  getMigrateStatus(): MaybePromise<DatabaseServiceStatus | 'notRequired'>

  migrate(): MaybePromise<unknown>

  clear(): MaybePromise<void>

  addBatch(records: REC[]): MaybePromise<unknown>
}
