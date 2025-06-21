import { AnonymousUser, Caller } from '../../core/caller.ts';
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

  /** Очищает и возвращает пользовательского caller-а */
  protected getUserCaller(reqScope: RequestScope): Exclude<Caller, AnonymousUser> {
    if (reqScope.caller.type === 'AnonymousUser') {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}] run domain called by AnonymousUser`,
        { reqScope },
      );
    }
    return reqScope.caller;
  }
}
