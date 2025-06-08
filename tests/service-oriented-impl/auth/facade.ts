import { AuthUser } from '../../../src/api/controller/types.js';
import { GeneralModuleResolver } from '../../../src/api/module/types.js';
import { Facadable } from '../../../src/api/resolve/facadable.js';
import { FullServiceResult } from '../../../src/api/service/types.js';
import { UuidType } from '../../../src/core/types.js';
import { AddingUserService } from './services/user/add-user/uc.js;
import { GetingUsersService } from './services/user/get-users/uc.js;

export interface AuthFacade {
  init(resolver: GeneralModuleResolver): void
  addUser(personIin: string, caller: AuthUser): Promise<FullServiceResult<AddingUserService>>
  // eslint-disable-next-line max-len
  getUsers(userIds: UuidType[], caller: AuthUser): Promise<FullServiceResult<GetingUsersService>>
}

export const AuthFacade = {
  instance(resolver: Facadable): AuthFacade {
    return resolver.resolveFacade(AuthFacade) as AuthFacade;
  },
};
