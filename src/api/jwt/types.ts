import { DTO } from '#core/index.ts';

export type JwtType = 'access' | 'refresh';

export type JwtPayload<P extends DTO> = P & {
  exp: number, // jwt expires
  typ: JwtType,
}
