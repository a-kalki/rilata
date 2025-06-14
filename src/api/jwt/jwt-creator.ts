import { JwtDto, JwtType } from '../../core/jwt/types.ts';

export interface JwtCreator<PAYLOAD extends JwtDto> {
  createToken(payload: PAYLOAD, type: JwtType): string;
}
