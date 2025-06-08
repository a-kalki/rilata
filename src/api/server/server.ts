import { Logger } from '../../core/logger/logger.js';
import { Module } from '../module/module.js';
import { ServerConfig, ServerResolveRRR } from './types.ts';

export abstract class Server<R extends ServerResolveRRR> {
  constructor(
    protected config: ServerConfig,
    protected resolver: R,
    protected modules: Module[],
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

  getModule<M extends Module>(name: M['moduleName']): M {
    const module = this.modules.find((m) => m.moduleName === name);
    if (module === undefined) {
      throw this.logger.error(`not finded module by name: ${name}`, this.modules);
    }
    return module as M;
  }

  getModules(): Module[] {
    return this.modules;
  }

  getLogger(): Logger {
    return this.resolver.logger;
  }

  getPublicHttpUrl(): string {
    const port = this.getPublicPort() === 80 ? '' : `:${this.getPublicPort()}`;
    return `http://${this.getPublicHost()}${port}`;
  }

  getPublicHttspUrl(): string {
    const port = this.getPublicPort() === 443 ? '' : `:${this.getPublicPort()}`;
    return `https://${this.getPublicHost()}${port}`;
  }

  getPublicUrl(): string {
    const { httpsPorts } = this.resolves;
    return httpsPorts.includes(this.getPublicPort())
      ? this.getPublicHttspUrl()
      : this.getPublicHttpUrl();
  }

  protected showServerStartedMessage(): void {
    this.resolver.logger.info(`Сервер ${this.config.serverName} запущен.`);
  }
}
