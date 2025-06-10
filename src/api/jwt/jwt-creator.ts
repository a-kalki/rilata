import { DTO } from '#core/index.ts';
import { JwtType } from './types.ts';

export interface JwtCreator<PAYLOAD extends DTO> {
  createToken(payload: PAYLOAD, type: JwtType): string;
}
