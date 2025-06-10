import { success } from '../../../core/result/success.js';
import { Result } from '../../../core/result/types.js';
import { TransactionStrategy } from '../transaction-strategy/strategy.js';
import { EventUCMeta, ServiceResult } from '../types.js';
import { RequestScope } from '#core/index.ts';
import { CommandUseCase } from './command.uc.ts';

export abstract class EventUseCase<META extends EventUCMeta> extends CommandUseCase<META> {
  abstract consumeModuleName: META['in']['moduleName'];

  protected validator!: never;

  protected supportedCallers!: never;

  protected abstract transactionStrategy: TransactionStrategy;

  async execute(input: META['in'], reqScope: RequestScope): Promise<ServiceResult<META>> {
    const result = await super.execute(input, reqScope);
    if (result.isFailure()) {
      throw this.logger.error(
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
