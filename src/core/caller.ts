import { IdType } from './types.ts';

export type AnonymousUser = {
  type: 'AnonymousUser',
};

export type AuthUser = {
  type: 'AuthUser',
  userId: IdType,
};

export type ModeratorUser = {
  type: 'ModeratorUser',
  userId: IdType,
};

export type Caller = AnonymousUser | AuthUser;

export type CallerType = Caller['type'];
