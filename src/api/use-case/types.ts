import { UCMeta } from '../../core/app-meta.ts';
import { UCBaseErrors } from '../../core/errors.ts';
import { Result } from '../../core/result/types.ts';
import { GetArrayType } from '../../core/type-functions.ts';

export type UcResult<P extends UCMeta> = Result<GetArrayType<P['errors']> | UCBaseErrors, P['success']>

export type RunDomainResult<P extends UCMeta> = Result<GetArrayType<P['errors']>, P['success']>
