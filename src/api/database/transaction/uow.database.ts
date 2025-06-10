import { MaybePromise, UuidType } from '../../../core/types.js';
import { Database } from '../database.js';

type TransactionId = UuidType;

export interface UnitOfWorkDatabase extends Database {
  startTransaction(): MaybePromise<TransactionId>

  commit(transactionId: TransactionId): Promise<void>

  rollback(transactionId: TransactionId): Promise<void>
}
