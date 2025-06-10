import { RequestScope } from '#api/module/types.ts';
import { CommandUCMeta } from '#core/app-meta.ts';
import { UcResult } from '#core/contract.ts';
import { TransactionStrategy } from '../transaction-strategy/strategy.ts';
import { QueryUseCase } from './query.uc.ts';

/** Сервис для обработки команд */
export abstract class CommandUseCase<META extends CommandUCMeta> extends QueryUseCase<META> {
  protected abstract transactionStrategy: TransactionStrategy;

  protected executeService(input: META['in'], reqScope: RequestScope): Promise<UcResult<META>> {
    return this.transactionStrategy.executeDatabaseScope(this, input, reqScope);
  }
}
