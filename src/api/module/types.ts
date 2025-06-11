import { Caller } from '../../core/caller.ts';
import { Result } from '../../core/result/types.ts';
import { DTO } from '../../core/types.ts';
import { Database } from '../database/database.ts';
import { ServerResolver } from '../server/types.ts';

export type Urls = string[] | RegExp[]; // example: ['/api/company-module/']

export type ModuleResolver = {
  moduleUrls: Urls,
  db: Database,
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

  execute(
    input: ExecutableInput, reqScope: RequestScope,
  ): Promise<Result<unknown, unknown>>
}
