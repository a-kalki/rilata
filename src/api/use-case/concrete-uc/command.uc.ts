import { CommandUCMeta, ServiceResult } from '../types.js';
import { TransactionStrategy } from '../transaction-strategy/strategy.js';
import { RequestScope } from '#core/request-data.ts';
import { QueryService } from './query.uc.ts';

/** Сервис для обработки команд */
export abstract class CommandService<META extends CommandUCMeta> extends QueryService<META> {
  protected abstract transactionStrategy: TransactionStrategy;

  protected executeService(input: META['in'], reqScope: RequestScope): Promise<ServiceResult<META>> {
    return this.transactionStrategy.executeDatabaseScope(this, input, reqScope);
  }
}
