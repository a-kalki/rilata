import { MaybePromise, RequestScope } from '#core/index.ts';
import { Result } from '../../../core/result/types.js';
import { UnitOfWorkDatabase } from '../../database/transaction/uow.database.js';
import { TransactionStrategy } from './strategy.js';

export class UowTransactionStrategy
  extends TransactionStrategy {
  protected async executeWithTransaction<
    IN, RET, S extends { runDomain:(input: IN, req: RequestScope) => MaybePromise<RET> }
  >(service: S, input: IN, reqScope: RequestScope): Promise<RET> {
    const db = this.moduleResolver.db as UnitOfWorkDatabase;
    if (!db) {
      reqScope.logger.error('Database not found');
    }

    const unitOfWorkId = await db.startTransaction() as string;
    reqScope.unitOfWorkId = unitOfWorkId;

    try {
      const res = await service.runDomain(input, reqScope) as Result<unknown, unknown>;
      if (res.isSuccess()) {
        await db.commit(unitOfWorkId);
      } else {
        await db.rollback(unitOfWorkId);
      }

      reqScope.unitOfWorkId = undefined;
      return res as RET;
    } catch (e) {
      await db.rollback(unitOfWorkId);
      reqScope.unitOfWorkId = undefined;
      throw e;
    }
  }
}
