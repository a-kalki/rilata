import { ModuleResolveRRRR } from '../../../src/api/module/m-resolves.js';
import { AuthFacade } from '../auth/facade.js';
import { CompanyFacade } from '../company/facade.js';
import { SubjectFacade } from '../subject/facade.js';
import { FrontProxyModule } from './module.js';

export type FrontendProxyResolves = ModuleResolveRRRR<FrontProxyModule> & {
  moduleUrls: ['/api/frontend-proxy-module/'],
  authFacade: AuthFacade,
  subjectFacade: SubjectFacade,
  companyFacade: CompanyFacade,
}
