import { Logger } from '#api/logger/logger.ts';
import { Executable, ExecutableInput, RequestScope, Resolvers } from '#api/module/types.ts';
import { Result } from '#core/result/types.ts';

/** Обработчик входящих в модуль запросов */
export abstract class UseCase implements Executable {
  abstract name: string;

  abstract inputName: string;

  constructor(protected resolvers: Resolvers) {}

  protected get logger(): Logger {
    return this.resolvers.serverResolver.logger;
  }

  abstract execute(
    input: ExecutableInput, reqScope: RequestScope,
  ): Promise<Result<unknown, unknown>>
}
