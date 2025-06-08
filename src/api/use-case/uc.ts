import { Resolvers } from '#api/module/types.ts';
import { Logger } from '../../core/logger/logger.js';
import { UCMeta } from './types.ts';

/** Обработчик входящих в модуль запросов */
export abstract class Service<META extends UCMeta> {
  abstract serviceName: META['name'];

  abstract inputName: META['in']['name'];

  constructor(protected resolvers: Resolvers) {}

  protected get logger(): Logger {
    return this.resolvers.serverResolver.logger;
  }

  abstract execute(...args: unknown[]): Promise<unknown>
}
