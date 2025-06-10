import { Caller } from '#core/caller.ts';

export type RequestScope = {
  caller: Caller,
  unitOfWorkId?: string,
  databaseErrorRestartAttempts?: number,
}
