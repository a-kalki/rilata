import { Logger } from '../logger/logger.ts';
import { Module } from '../module/module.ts';
import { ModuleMeta } from '../module/types.ts';
import { ServerConfig, ServerMeta } from './types.ts';

export abstract class Server<META extends ServerMeta> {
  abstract name: META['name'];

  constructor(
    protected config: ServerConfig,
    protected resolver: META['resolver'],
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
      this.resolver.logger.info(`Сервер ${this.name} остановлен`);
      this.stop();
      process.exit(0);
    });

    process.once('SIGTERM', () => {
      this.resolver.logger.info(`Сервер ${this.name} остановлен`);
      this.stop();
      process.exit(0);
    });
  }

  getResolver(): META['resolver'] {
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

  getModules(): Module<ModuleMeta>[] {
    return this.modules;
  }

  getLogger(): Logger {
    return this.resolver.logger;
  }

  protected showServerStartedMessage(): void {
    this.resolver.logger.info(`Сервер ${this.name} запущен.`);
  }
}
