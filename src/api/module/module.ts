/* eslint-disable no-use-before-define */
import { Logger } from '../../core/logger/logger.js';
import { Service } from '../service/uc.js;
import { ServerResolveRRR } from '../server/types.js';
import { Controller } from '#api/controller/controller.js';
import { ModuleController } from '#api/controller/m-controller.js';
import { ModuleConfig, ModuleResolveRRRR, Resolvers } from './types.ts';
import { Server } from '#api/base.index.ts';

export abstract class Module<R extends Resolvers> {
  protected abstract moduleController: ModuleController;

  abstract executeService(...args: unknown[]): Promise<unknown>

  abstract getServices(): Service<R>[]

  constructor(
    protected config: ModuleConfig,
    protected resolver: ModuleResolveRRRR,
    protected server: Server,
  ): void {
    this.logger.info(`  | resolver for module ${this.moduleName} inited successfully`);

    this.getModuleController().init(resolver);
  }

  getModuleName(): string {
    return this.config.moduleName;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stop(): void {}

  getModuleController(): Controller<GeneralModuleResolver> {
    return this.moduleController;
  }

  getModuleResolver(): GeneralModuleResolver {
    return this.resolver;
  }

  getLogger(): Logger {
    return this.serverResolver.logger;
  }
}
