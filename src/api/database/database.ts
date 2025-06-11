import { DTO, MaybePromise } from '../../core/types.ts';
import { Repository } from './repository.ts';
import { DatabaseServiceStatus, BatchRecords } from './types.ts';

export interface Database {
  getRepositories(): Repository<string, DTO>[]

  createDb(): MaybePromise<unknown>

  clearDb(): MaybePromise<unknown>

  migrateDb(): MaybePromise<unknown>

  creationStatus(): MaybePromise<DatabaseServiceStatus>

  migrationStatus(): MaybePromise<DatabaseServiceStatus>

  addBatch<R extends Repository<string, DTO>>(
    batchRecords: BatchRecords<R>
  ): MaybePromise<unknown>

  stop(): void
}
