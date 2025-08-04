import { IdType } from './types.ts';

export type AnonymousUser = {
  type: 'AnonymousUser',
};

export type AuthUser = {
  type: 'AuthUser',
  id: IdType,
  support?: {
    isModerator?: false,
  }
};

export type ModeratorUser = {
  type: 'ModeratorUser',
  id: IdType,
  support?: {
    isModerator?: true,
  }
};

export type CheckedCaller = Exclude<Caller, AnonymousUser>;

export type Caller = AnonymousUser | AuthUser | ModeratorUser;

export type CallerType = Caller['type'];
