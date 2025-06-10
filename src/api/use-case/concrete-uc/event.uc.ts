import { RequestScope } from '#api/module/types.ts';
import { EventUCMeta } from '#core/app-meta.ts';
import { UcResult } from '#core/contract.ts';
import { success } from '../../../core/result/success.ts';
import { Result } from '../../../core/result/types.ts';
import { TransactionStrategy } from '../transaction-strategy/strategy.ts';
import { CommandUseCase } from './command.uc.ts';

export abstract class EventUseCase<META extends EventUCMeta> extends CommandUseCase<META> {
  abstract consumeModuleName: META['in']['moduleName'];

  protected validator!: never;

  protected supportedCallers!: never;

  protected abstract transactionStrategy: TransactionStrategy;

  async execute(input: META['in'], reqScope: RequestScope): Promise<UcResult<META>> {
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
