import { Caller } from '../../core/caller.ts';
import { Result } from '../../core/result/types.ts';
import { DTO } from '../../core/types.ts';
import { ServerResolver } from '../server/types.ts';

export type Urls = (string | RegExp)[]; // example: ['/api/company-module/']

export type ModuleResolver = Record<string, unknown>;

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

export type ModuleConfig = {
  moduleUrls: Urls
};

export type RequestScope = {
  caller: Caller,
  unitOfWorkId?: string,
  databaseErrorRestartAttempts?: number,
}

export type ExecutableInput = {
  name: string,
  attrs: DTO,
  requestId: string,
};

export type Executable = {
  inputName: string;

  init(resolvers: Resolvers): void

  execute(
    input: ExecutableInput, reqScope: RequestScope,
  ): Promise<Result<unknown, unknown>>
}
