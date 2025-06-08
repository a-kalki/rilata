import { GeneralModuleResolver } from '#api/base.index.ts';
import { IdType, Logger } from './index.ts';

export type AnonymousUser = {
  type: 'AnonymousUser',
};

export type AuthUser = {
  type: 'AuthUser',
  userId: IdType,
};

export type Caller = AnonymousUser | AuthUser;

export type CallerType = Caller['type'];

export type RequestData = {
  requestId: IdType,
  caller: Caller,
}

export type RequestScope = RequestData & {
  resolver: GeneralModuleResolver,
  logger: Logger,
  unitOfWorkId?: string,
  databaseErrorRestartAttempts?: number,
}
