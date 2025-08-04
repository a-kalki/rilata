import { AuthUser, Caller, CheckedCaller, ModeratorUser } from "../../caller.ts";
import { AssertionException } from "../../exeptions.ts";

class CallerUtils {
  isUserCaller(caller: Caller): caller is CheckedCaller {
    return caller.type !== 'AnonymousUser';
  }

  userCaller(caller: Caller): CheckedCaller {
    if (caller.type === 'AnonymousUser') {
      throw new AssertionException(
        'founded anonymous caller type',
      )
    }
    return caller;
  }

  createUser(userId: string): AuthUser {
    return { id: userId, type: 'AuthUser' }
  }

  createModerator(userId: string): ModeratorUser {
    return { id: userId, type: 'ModeratorUser', support: { isModerator: true } }
  }
}

export const callerUtils = new CallerUtils();
