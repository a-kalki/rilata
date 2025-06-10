/* eslint-disable no-use-before-define */
import { Logger } from '../../core/logger/logger.js';
import { ModuleConfig, ModuleMeta, ModuleResolver } from './types.ts';
import { ServerResolver } from '#api/server/types.ts';
import { RequestScope } from '#core/request-data.ts';
import { Controller } from '#api/controller/controller.ts';

export abstract class Module<META extends ModuleMeta> {
  abstract name: META['name']

  abstract moduleController: Controller;

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
