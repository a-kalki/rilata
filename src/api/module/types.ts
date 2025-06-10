import { Database } from '#api/database/database.ts';
import { Logger } from '#api/logger/logger.ts';
import { ServerResolver } from '#api/server/types.ts';
import { RequestScope } from '#api/types.ts';
import { BackendErrors } from '#core/errors.ts';
import { Result } from '#core/result/types.ts';
import { DTO } from '#core/types.ts';

export type Urls = string[] | RegExp[]; // example: ['/api/company-module/']

export type ModuleResolver = {
  logger: Logger,
  moduleUrls: Urls,
  db?: Database,
}

export type Resolvers = {
  serverResolver: ServerResolver,
  moduleResolver: ModuleResolver,
}

export type ModuleMeta = {
  name: string, // имя модуля (для кода)
  title?: string, // название для пользователя (документации)
  description?: string, // описание для пользователя (документации)
  resolvers: Resolvers,
}

export type ModuleConfig = DTO;

export type ExecutableInput = {
  name: string,
  attrs: DTO,
  requestId: string,
};

export type Executable = {
  inputName: string;

  execute(
    input: ExecutableInput, reqScope: RequestScope,
  ): Promise<Result<BackendErrors, unknown>>
}
