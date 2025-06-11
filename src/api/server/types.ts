import { RunMode } from '../../core/types.ts';
import { JwtCreator } from '../jwt/jwt-creator.ts';
import { JwtDecoder } from '../jwt/jwt-decoder.ts';
import { JwtVerifier } from '../jwt/jwt-verifier.ts';
import { JwtDto } from '../jwt/types.ts';
import { Logger } from '../logger/logger.ts';

export type ServerConfig = Record<string, unknown>

export type ServerResolver = {
  logger: Logger,
  runMode: RunMode,
  jwtDecoder: JwtDecoder<JwtDto>,
  jwtVerifier: JwtVerifier<JwtDto>,
  jwtCreator: JwtCreator<JwtDto>,
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
