/* eslint-disable no-bitwise */
import { JwtCreator, JwtVerifier } from '#api/http.index.ts';
import { DTO, JwtDecoder, Logger } from '#core/index.ts';
import { loggerModes } from '../../core/logger/logger-modes.js';

export type RunMode = 'test' | 'devvelopment' | 'production';

export type ServerConfig = {
  serverName: string,
  loggerModes: Array<keyof typeof loggerModes> | 'all' | 'off'
}

export type ServerResolveRRR = {
  logger: Logger,
  runMode: RunMode,
  jwtDecoder: JwtDecoder<DTO>,
  jwtVerifier: JwtVerifier<DTO>,
  jwtCreator: JwtCreator<DTO>,
}

export type JwtConfig = {
  algorithm: 'HS256' | 'HS512', // default 'HS256'
  jwtLifetimeAsHour: number, // default 1 day (24)
  jwtRefreshLifetimeAsHour: number
}

export type ServerMeta = {
  name: string,
  description: string,
  resolver: ServerResolveRRR
}
