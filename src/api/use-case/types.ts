/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import { Result } from '../../core/result/types.js';
import { ResultDTO } from '../controller/types.js';
import { ServerMeta } from '#api/server/types.ts';
import { ARMeta, ArPublishEventMeta, ErrorMeta, InputMeta } from '#domain/meta-types.ts';
import { ModuleMeta } from '#api/module/types.ts';
import { ServiceBaseErrors } from './app-error-types.ts';

export type AppErrorMeta = {
  name: string;
  description: string;
  type: 'app-error'
}

export type UCMeta = {
  name: string;
  description: string;
  in: InputMeta;
  server: ServerMeta;
  module: ModuleMeta;
}

export type QueryUCMeta = UCMeta & {
  success: unknown;
  errors: ErrorMeta[];
  aRoot: ARMeta;
}

export type CommandUCMeta = QueryUCMeta & {
  emitsEvents: ArPublishEventMeta[];
}

export type EventUCMeta = Omit<CommandUCMeta, 'input' | 'errors' | 'out'> & {
  comsumeModuleName: string;
  consumesEvents: Event[];
  input: ArPublishEventMeta;
  errors: never;
  out: undefined;
}

export type RunDomainResult<P extends QueryUCMeta> = Result<P['errors'], P['success']>

export type ServiceResult<P extends QueryUCMeta> = Result<P['errors'] | ServiceBaseErrors, P['success']>

export type ServiceResultDTO<P extends QueryUCMeta> = ResultDTO<P['errors'] | ServiceBaseErrors, P['success']>
