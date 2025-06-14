import { Result } from '../../core/result/types.ts';
import { Logger } from '../logger/logger.ts';
import { Executable, ExecutableInput, ModuleResolver, RequestScope, Resolvers } from '../module/types.ts';
import { ServerResolver } from '../server/types.ts';

/** Обработчик входящих в модуль запросов */
export abstract class UseCase implements Executable {
  abstract name: string;

  abstract inputName: string;

  abstract arName: string;

  protected moduleResolver!: ModuleResolver;

  protected serverResolver!: ServerResolver;

  protected get logger(): Logger {
    return this.serverResolver.logger;
  }

  init(resolvers: Resolvers): void {
    this.moduleResolver = resolvers.moduleResolver;
    this.serverResolver = resolvers.serverResolver;
  }

  abstract execute(
    input: ExecutableInput, reqScope: RequestScope,
  ): Promise<Result<unknown, unknown>>
}
