import { Caller, AuthUser } from '../../../src/api/controller/types.js';
import { GeneralModuleResolver } from '../../../src/api/module/types.js';
import { Facadable } from '../../../src/api/resolve/facadable.js';
import { FullServiceResult } from '../../../src/api/service/types.js';
import { AddPersonRequestDodAttrs } from './services/person/add-person/s-params.js';
import { AddingPersonService } from './services/person/add-person/uc.js;
import { GetingPersonByIinService } from './services/person/get-by-iin/uc.js;

export interface SubjectFacade {
  init(resolver: GeneralModuleResolver): void
  getPersonByIin(
    iin: string, caller: Caller
  ): Promise<FullServiceResult<GetingPersonByIinService>>
  addPerson(
    input: AddPersonRequestDodAttrs, caller: AuthUser
  ): Promise<FullServiceResult<AddingPersonService>>
}

export const SubjectFacade = {
  instance(resolver: Facadable): SubjectFacade {
    return resolver.resolveFacade(SubjectFacade) as SubjectFacade;
  },
};
