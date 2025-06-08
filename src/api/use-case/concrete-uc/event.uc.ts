import { success } from '../../../core/result/success.js';
import { Result } from '../../../core/result/types.js';
import { BusMessageType } from '../../bus/types.js';
import { TransactionStrategy } from '../transaction-strategy/strategy.js';
import { EventUCMeta, ServiceResult } from '../types.js';
import { RequestScope } from '#core/index.ts';
import { CommandService } from './command.uc.ts';

export abstract class EventService<META extends EventUCMeta> extends CommandService<META> {
  abstract busMessageType: BusMessageType;

  abstract eventName: META['in']['name'];

  abstract eventModuleName: string;

  protected validator!: never;

  protected supportedCallers!: never;

  protected abstract transactionStrategy: TransactionStrategy;

  get handleName(): string {
    return this.eventName;
  }

  protected executeService(input: META['in'], reqScope: RequestScope): Promise<ServiceResult<META>> {
    return this.transactionStrategy.executeDatabaseScope(this, input, reqScope);
  }

  async execute(input: META['in'], reqScope: RequestScope): Promise<ServiceResult<META>> {
    const result = await super.execute(input, reqScope);
    if (result.isFailure()) {
      throw this.moduleResolver.getLogger().error(
        'recieved failure result for event service',
        { input, result },
      );
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected runInitialChecks(input: META['in'], reqScope: RequestScope): Result<never, undefined> {
    // Для событий не выполняется проверка разрешений и валидации
    return success(undefined);
  }
}
