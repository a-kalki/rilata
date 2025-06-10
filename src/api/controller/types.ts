import { Caller } from '#core/request-data.ts';

export type RilataRequest =
  Request
  & { caller: Caller }
  & { headers: Headers & { Authorization: string } }
