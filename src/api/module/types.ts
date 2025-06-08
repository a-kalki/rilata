import { Database } from '#api/db.index.ts';
import { ServerResolveRRR } from '#api/server/types.ts';
import { UCMeta } from '#api/use-case/types.ts';
import { Service } from '#api/use-case/uc.ts';
import { Logger } from '#core/index.ts';

export type ModuleResolveRRRR = {
  logger: Logger,
  db?: Database,
}

export type ModuleMeta = {
  name: string, // имя модуля (для кода)
  title: string, // название для пользователя (документации)
  description: string, // описание для пользователя (документации)
  responsibilities: string[], // задачи модуля
  resolver: ModuleResolveRRRR,
  // dependencies: string[], // зависимости на другие модули
}

export type ModuleConfig = {
  moduleName: string,
  modulePath: string,
  moduleUrls: [string | RegExp, Service<UCMeta>], // example: ['/api/company-module/']
}

export type Resolvers = {
  serverResolver: ServerResolveRRR,
  moduleResolver: ModuleResolveRRRR,
}
