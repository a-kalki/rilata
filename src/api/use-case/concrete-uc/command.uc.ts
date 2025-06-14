import { CommandUCMeta } from '../../../core/app-meta.ts';
import { RequestScope, Resolvers } from '../../module/types.ts';
import { TransactionStrategy } from '../transaction-strategy/strategy.ts';
import { UcResult } from '../types.ts';
import { QueryUseCase } from './query.uc.ts';

/** Сервис для обработки команд */
export abstract class CommandUseCase<
R extends Resolvers,
META extends CommandUCMeta
> extends QueryUseCase<R, META> {
  protected abstract transactionStrategy: TransactionStrategy;

  protected executeService(input: META['in'], reqScope: RequestScope): Promise<UcResult<META>> {
    return this.transactionStrategy.executeDatabaseScope(this, input, reqScope);
  }
}
