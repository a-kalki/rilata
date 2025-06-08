import { RequestScope } from '#core/index.ts';
import { MaybePromise } from '#core/types.ts';
import { DatabaseObjectSavingError, OptimisticLockVersionMismatchError } from '../../../core/exeptions.js';

export abstract class TransactionStrategy {
  /** Ответственнен за выполнение транзацкии */
  protected abstract executeWithTransaction<
    IN, RET, S extends { runDomain:(input: IN, req: RequestScope) => MaybePromise<RET> }
  >(service: S, input: IN, reqScope: RequestScope): RET | Promise<RET>

  /** Запускает доменный слой, перезапускает в случае получения ошибок БД. */
  async executeDatabaseScope<
    IN, RET, S extends { runDomain:(input: IN, req: RequestScope) => MaybePromise<RET> }
  >(service: S, input: IN, reqScope: RequestScope): Promise<RET> {
    reqScope.databaseErrorRestartAttempts = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.executeWithTransaction(service, input, reqScope) as MaybePromise<RET>;
        reqScope.databaseErrorRestartAttempts = undefined;
        return r;
      } catch (e) {
        const { caller, logger } = reqScope;
        if (e instanceof OptimisticLockVersionMismatchError) {
          logger.warning(
            'Произошла оптимистичная блокировка БД, пробуем перезапуститься...',
            { errorDesctiption: String(e), input, caller },
          );
        } else if (e instanceof DatabaseObjectSavingError) {
          if (reqScope.databaseErrorRestartAttempts === 0) {
            logger.error(
              'Произошла ошибка БД, перезапуск не помог, прокидываем ошибку дальше...',
              { errorDesctiption: String(e), input, caller },
              e,
            );
            throw e;
          }
          logger.warning(
            'Произошла ошибка БД, пробуем перезапуститься...',
            { errorDesctiption: String(e), input, caller },
          );
          // @ts-expect-error
          reqScope.databaseErrorRestartAttempts -= 1;
        } else {
          throw e;
        }
      }
    }
  }
}
