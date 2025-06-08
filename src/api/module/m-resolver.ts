/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetModule } from './types.js';
import { Module } from './module.js';
import { GetServerResolves } from '../server/types.js';
import { ServerResolver } from '../server/s-resolver.js';
import { ServerResolveRRR } from '../server/s-resolves.js';
import { ModuleResolveRRRR } from './m-resolves.js';
import { DTO } from '#core/types.ts';

export abstract class ModuleResolver<
  S_RES extends ServerResolver<ServerResolveRRR<DTO>>, MR extends ModuleResolveRRRR<Module>,
> {
  protected module!: GetModule<MR>;

  protected serverResolver!: S_RES;

  constructor(protected resolves: MR) {}

  getModulePath(): string {
    return this.resolves.modulePath;
  }

  getProjectPath(): string {
    return this.serverResolver.getProjectPath();
  }

  init(module: GetModule<MR>, serverResolver: S_RES): void {
    this.module = module;
    this.serverResolver = serverResolver;

    this.initResolves();
  }

  stop(): void {
    this.getDatabase().stop();
  }

  getServerResolver(): S_RES {
    return this.serverResolver;
  }

  getModuleResolves(): MR {
    return this.resolves;
  }

  getLogger(): GetServerResolves<S_RES>['logger'] {
    return this.serverResolver.getLogger();
  }

  getDatabase(): MR['db'] {
    return this.resolves.db;
  }

  getModuleUrls(): MR['moduleUrls'] {
    return this.resolves.moduleUrls;
  }

  getModuleName(): MR['moduleName'] {
    return this.resolves.moduleName;
  }

  getModule(): GetModule<MR> {
    return this.module;
  }

  protected initResolves(): void {
    Object.values(this.resolves).forEach((item) => {
      const resolve = item as any;
      if (resolve.init && typeof resolve.init === 'function') {
        (item as any).init(this);
      }
    });
  }
}
