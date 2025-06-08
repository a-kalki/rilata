import { JwtType } from '../../core/jwt/types.js';
import { DTO } from '../../domain/dto.js';
import { ServerResolver } from '../server/s-resolver.js';
import { ServerResolveRRR } from '../server/s-resolves.js';

export interface JwtCreator<PAYLOAD extends DTO> {
  init(resolver: ServerResolver<ServerResolveRRR<PAYLOAD>>): void
  createToken(payload: PAYLOAD, type: JwtType): string;
}
