import { Result } from '../../core/result/types.js';
import { UCBaseErrors } from '#core/errors.ts';
import { UCMeta } from '#core/app-meta.ts';

export type UcResult<P extends UCMeta> = Result<P['errors'] | UCBaseErrors, P['success']>

export type RunDomainResult<P extends UCMeta> = Result<P['errors'], P['success']>
