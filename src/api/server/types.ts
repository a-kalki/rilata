/* eslint-disable no-bitwise */
import { JwtCreator, JwtVerifier } from '#api/http.index.ts';
import { DTO, RunMode } from '#core/types.ts';

export type ServerConfig = {
  loggerModes: Array<keyof typeof loggerModes> | 'all' | 'off'
}

export type ServerResolver = {
  logger: Logger,
  runMode: RunMode,
  jwtDecoder: JwtDecoder<DTO>,
  jwtVerifier: JwtVerifier<DTO>,
  jwtCreator: JwtCreator<DTO>,
}

export type ServerMeta = {
  name: string,
  description?: string,
  resolver: ServerResolver
}

export type JwtConfig = {
  algorithm: 'HS256' | 'HS512', // default 'HS256'
  jwtLifetimeAsHour: number, // default 1 day (24)
  jwtRefreshLifetimeAsHour: number
}
