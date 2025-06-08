import { EventRepository } from '../../../src/api/database/event.repository.js';
import { ModuleResolveRRRR } from '../../../src/api/module/m-resolves.js';
import { PersonRepository } from './domain-object/person/repo.js';
import { SubjectModule } from './module.js';

export type SubjectResolves = ModuleResolveRRRR<SubjectModule> & {
  moduleUrls: ['/api/subject-module/'],
  personRepo: PersonRepository,
  eventRepo: EventRepository<true>,
}
