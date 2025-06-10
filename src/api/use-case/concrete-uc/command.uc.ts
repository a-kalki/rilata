import { CommandUCMeta, ServiceResult } from '../types.js';
import { TransactionStrategy } from '../transaction-strategy/strategy.js';
import { RequestScope } from '#core/request-data.ts';
import { QueryUseCase } from './query.uc.ts';

/** Сервис для обработки команд */
export abstract class CommandUseCase<META extends CommandUCMeta> extends QueryUseCase<META> {
  protected abstract transactionStrategy: TransactionStrategy;

  protected executeService(input: META['in'], reqScope: RequestScope): Promise<ServiceResult<META>> {
    return this.transactionStrategy.executeDatabaseScope(this, input, reqScope);
  }
}
