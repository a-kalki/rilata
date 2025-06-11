import { MaybePromise } from '../../../../core/types.ts';
import { Logger } from '../../../logger/logger.ts';
import { RequestScope } from '../../../module/types.ts';
import { TransactionStrategy } from '../../../use-case/transaction-strategy/strategy.ts';
import { BunSqliteDatabase } from '../database.ts';

export class BunSqliteStrategy extends TransactionStrategy {
  constructor(protected db: BunSqliteDatabase, logger: Logger) {
    super(logger);
  }

  protected executeWithTransaction<
    IN, RET, S extends { runDomain:(input: IN, req: RequestScope) => MaybePromise<RET> }
  >(service: S, input: IN, reqScope: RequestScope): RET {
    const transactionFn = this.db.sqliteDb.transaction(() => service.runDomain(input, reqScope));
    return transactionFn();
  }
}
