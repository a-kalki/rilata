import { BusMessageRepository } from '../../../src/api/database/bus-message.repository.js';
import { EventRepository } from '../../../src/api/database/event.repository.js';
import { ModuleResolveRRRR } from '../../../src/api/module/m-resolves.js';
import { CompanyReadRepository } from './domain/company/repo.js';
import { CompanyReadModule } from './module.js';

export type CompanyReadResolves = ModuleResolveRRRR<CompanyReadModule> & {
  moduleUrls: ['/api/company-read-module/'],
  companyRepo: CompanyReadRepository,
  busMessageRepo: BusMessageRepository<true>,
  eventRepo: EventRepository<true>
}
