import { UCMeta } from '../../core/app-meta.ts';
import { UCBaseErrors } from '../../core/errors.ts';
import { Result } from '../../core/result/types.ts';

export type UcResult<P extends UCMeta> = Result<P['errors'] | UCBaseErrors, P['success']>

export type DomainResult<P extends UCMeta> = Result<P['errors'], P['success']>
