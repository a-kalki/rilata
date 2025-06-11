import { Result } from '../../../core/result/types.ts';
import { MaybePromise } from '../../../core/types.ts';
import { UnitOfWorkDatabase } from '../../database/transaction/uow.database.ts';
import { Logger } from '../../logger/logger.ts';
import { RequestScope } from '../../module/types.ts';
import { TransactionStrategy } from './strategy.ts';

export class UowTransactionStrategy
  extends TransactionStrategy {
  constructor(protected db: UnitOfWorkDatabase, protected logger: Logger) {
    super(logger);
  }

  protected async executeWithTransaction<
    IN, RET, S extends { runDomain:(input: IN, req: RequestScope) => MaybePromise<RET> }
  >(service: S, input: IN, reqScope: RequestScope): Promise<RET> {
    const unitOfWorkId = await this.db.startTransaction() as string;
    reqScope.unitOfWorkId = unitOfWorkId;

    try {
      const res = await service.runDomain(input, reqScope) as Result<unknown, unknown>;
      if (res.isSuccess()) {
        await this.db.commit(unitOfWorkId);
      } else {
        await this.db.rollback(unitOfWorkId);
      }

      reqScope.unitOfWorkId = undefined;
      return res as RET;
    } catch (e) {
      await this.db.rollback(unitOfWorkId);
      reqScope.unitOfWorkId = undefined;
      throw e;
    }
  }
}
