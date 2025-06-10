import { AppErrorMeta, UCMeta } from './app-meta.ts';
import { BackendErrors, UCBaseErrors } from './errors.ts';
import { Result } from './result/types.ts';
import { GetArrayType } from './type-functions.ts';

export type ResultDTO<FAIL, SUCCESS> = {
  success: false,
  httpStatus: number,
  payload: FAIL,
} | {
  success: true,
  httpStatus: number,
  payload: SUCCESS,
};

type AllAppErrors<ERRS extends AppErrorMeta> = {
  errors: ERRS
} // тип который следит чтобы были только Apperror типы

export type UcResult<M extends UCMeta> = Result <UCBaseErrors | GetArrayType<M['errors']>, M['success']>

export type BackendResult = Result<AllAppErrors<BackendErrors>['errors'], unknown>

export type BackendResultDTO = ResultDTO<AllAppErrors<BackendErrors>['errors'], unknown>
