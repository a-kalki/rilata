import { Caller } from "../../core/caller.ts";

export type RilataRequest =
  Request
  & { caller: Caller }
  & { headers: Headers & { Authorization: string } }
