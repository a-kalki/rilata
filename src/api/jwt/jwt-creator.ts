import { JwtDto, JwtType } from './types.ts';

export interface JwtCreator<PAYLOAD extends JwtDto> {
  createToken(payload: PAYLOAD, type: JwtType): string;
}
