export type JwtType = 'access' | 'refresh';

export type JwtDto = {
  userId: string,
  support?: {
    isModerator?: boolean,
  }
}

export type JwtPayload<P extends JwtDto> = P & {
  exp: number, // jwt expires
  typ: JwtType,
}
