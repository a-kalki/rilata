import { Controller } from '../controller/controller.ts';
import { Logger } from '../logger/logger.ts';
import { ServerResolver } from '../server/types.ts';
import { ModuleConfig, ModuleMeta, ModuleResolver, RequestScope } from './types.ts';

export abstract class Module<META extends ModuleMeta> {
  abstract name: META['name']

  abstract getController(): Controller;

  abstract handleRequest(input: unknown, reqScope: RequestScope): Promise<unknown>

  constructor(
    protected config: ModuleConfig,
    protected resolvers: META['resolvers'],
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop(): void {}

  getServerResolver(): ServerResolver {
    return this.resolvers.serverResolver;
  }

  getModuleResolver(): ModuleResolver {
    return this.resolvers.moduleResolver;
  }

  getLogger(): Logger {
    return this.resolvers.serverResolver.logger;
  }
}
