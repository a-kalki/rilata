import { UCBaseErrors } from '#core/errors.ts';
import { UCMeta } from '#core/app-meta.ts';
import { GetArrayType } from '#core/type-functions.ts';
import { Result } from '#core/result/types.ts';

export type UcResult<P extends UCMeta> = Result<P['errors'] | UCBaseErrors, P['success']>

export type RunDomainResult<P extends UCMeta> = Result<GetArrayType<P['errors']>, P['success']>
