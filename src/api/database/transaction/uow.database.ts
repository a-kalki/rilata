import { MaybePromise, UuidType } from '../../../core/types.ts';
import { Database } from '../database.ts';

type TransactionId = UuidType;

export interface UnitOfWorkDatabase extends Database {
  startTransaction(): MaybePromise<TransactionId>

  commit(transactionId: TransactionId): Promise<void>

  rollback(transactionId: TransactionId): Promise<void>
}
