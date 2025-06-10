import { ModuleMeta } from '#api/module/types.ts';
import { Logger } from '../../core/logger/logger.js';
import { Module } from '../module/module.js';
import { ServerConfig, ServerMeta } from './types.ts';

export abstract class Server<R extends ServerMeta> {
  constructor(
    protected config: ServerConfig,
    protected resolver: R['resolver'],
    protected modules: Module<ModuleMeta>[],
  ) {}

  protected abstract startServer(): void

  stop(): void {
    this.modules.forEach((m) => m.stop());
  }

  start(): void {
    this.startServer();
    this.showServerStartedMessage();

    process.once('SIGINT', () => {
      this.resolver.logger.info(`Сервер ${this.config.serverName} остановлен`);
      this.stop();
      process.exit(0);
    });

    process.once('SIGTERM', () => {
      this.resolver.logger.info(`Сервер ${this.config.serverName} остановлен`);
      this.stop();
      process.exit(0);
    });
  }

  getResolver(): R {
    return this.resolver;
  }

  getProjectPath(): string {
    return process.cwd(); // path/to/project
  }

  getModule<M extends Module<ModuleMeta>>(name: M['name']): M {
    const module = this.modules.find((m) => m.name === name);
    if (module === undefined) {
      this.getLogger().error(`not finded module by name: ${name}`, this.modules);
    }
    return module as M;
  }

  getModules(): Module[] {
    return this.modules;
  }

  getLogger(): Logger {
    return this.resolver.logger;
  }

  protected showServerStartedMessage(): void {
    this.resolver.logger.info(`Сервер ${this.config.serverName} запущен.`);
  }
}
