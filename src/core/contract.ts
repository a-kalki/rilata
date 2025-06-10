import { UCMeta } from './app-meta.ts';
import { BackendErrors } from './errors.ts';
import { Result } from './result/types.ts';

export type ResultDTO<FAIL, SUCCESS> = {
  success: false,
  httpStatus: number,
  payload: FAIL,
} | {
  success: true,
  httpStatus: number,
  payload: SUCCESS,
};

export type BackendResult<P extends UCMeta> = Result<P['errors'] | BackendErrors, P['success']>

export type BackendResultDTO<P extends UCMeta> = ResultDTO<P['errors'] | BackendErrors, P['success']>
