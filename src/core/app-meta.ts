import { ARMeta, ArPublishEvent, DomainErrorMeta } from '../domain/meta-types.ts';
import { DTO } from './types.ts';

export type InputMeta = {
  name: string, // имя команды
  requestId: string,
  attrs: DTO, // параметры команды
}

export type AppErrorMeta = {
  name: string;
  type: 'app-error'
  description?: string;
}

export type UcPublishEventMeta = ArPublishEvent & {
  moduleName: string;
}

export type UCMeta = {
  name: string;
  in: InputMeta;
  success: unknown;
  errors: DomainErrorMeta;
  aRoot: ARMeta;
}

export type CommandUCMeta = UCMeta & {
  events: ArPublishEvent;
}

export type EventUCMeta = Omit<CommandUCMeta, 'in' | 'errors' | 'out'> & {
  in: UcPublishEventMeta;
  errors: never;
  out: undefined;
}
