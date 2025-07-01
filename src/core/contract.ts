import { AppErrorMeta, UCMeta } from './app-meta.ts';
import { BackendErrors, UCBaseErrors } from './errors.ts';
import { Result } from './result/types.ts';

export type PatchValue<T> = { // значение null позволяет стирать данные
  [K in keyof T]: undefined extends T[K]
    // null: стереть значение
    // undefined: оставить старое значение
    ? T[K] | undefined | null
    : T[K];        // поле обязательное — null нельзя
};

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

type AllBackenErrors = AllAppErrors<BackendErrors>['errors'];

export type UcResult<M extends UCMeta> = Result <UCBaseErrors | M['errors'], M['success']>

export type BackendResultByMeta<M extends UCMeta> = Result<AllBackenErrors | M['errors'], M['success']>

export type BackendResult = Result<AllBackenErrors, unknown>

export type BackendResultDTO = ResultDTO<AllAppErrors<BackendErrors>['errors'], unknown>
