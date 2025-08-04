import { BunServerConfig } from './types.ts';
import { JwtConfig } from '../types.ts';
import { RunMode } from '../../../core/types.ts';

export const defaultServerConfig: BunServerConfig = {
  localHost: 'localhost',
  localPort: 3000,
  loggerModes: 'all',
  serverName: 'default-server',
  maxUploadFileSizeByte: 300 * 1024 * 1024,
};

export const defaultJwtConfig: JwtConfig = {
  algorithm: 'HS256',
  jwtLifetimeAsHour: 24 * 2,
  jwtRefreshLifetimeAsHour: 2,
};

export const defaultPublicPort = 80;

function throwErr(errStr: string): never {
  throw Error(errStr);
}

export function getJwtSecretKey(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw Error('not found jwt secret key in env.JWT_SECRET');
  return secret;
}

export function getPublicHost(host?: string): string {
  return process.env.PUBLIC_HOST ?? host ?? throwErr('not found public host name in env.PUBPLIC_HOST');
}

export function getPublicPort(port?: number): number {
  const publicPort = Number(process.env.PUBLIC_PORT);
  return isNaN(publicPort) ? (port ?? 80) : publicPort;
}

export function getJwtConfig(config?: Partial<JwtConfig>): JwtConfig {
  const inputConfig = config ?? {};
  return {
    ...defaultJwtConfig,
    ...inputConfig,
  };
}

export function getAppName(name?: string): string {
  return process.env.APP_NAME ?? name ?? throwErr('not found app name in env.APP_NAME');
}

export function getBotLoggerToken(): string {
  return process.env.BOT_LOGGER_TOKEN ?? throwErr('not found bot logger token in env.BOT_LOGGER_TOKEN');
}

export function getBotLoggerManagerIds(): string[] {
  const ids = process.env.BOT_LOGGER_MANAGER_IDS ?? throwErr('not found bot logger manager ids in env.BOT_LOGGER_MANAGER_IDS');
  return ids.split(',').map((id) => id.trim());
}

export function getServerConfig(config?: Partial<BunServerConfig>): BunServerConfig {
  let envPort: number | undefined = Number(process.env.LOCAL_PORT);
  envPort = isNaN(envPort) ? undefined : envPort;
  return {
    localPort: envPort ?? config?.localPort ?? defaultServerConfig.localPort,
    localHost: process.env.LOCAL_HOST ?? config?.localHost ?? defaultServerConfig.localHost,
    maxUploadFileSizeByte: config?.maxUploadFileSizeByte ?? defaultServerConfig.maxUploadFileSizeByte
  };
}

function getEnvRunMode(): RunMode | undefined {
  const mode = process.env.NODE_ENV;
  if (mode === 'prod' || mode === 'production') return 'production';
  if (mode === 'dev' || mode === 'development') return 'development';
  if (mode === 'test') return 'test';
  return undefined;

  // const allModes: UnionToTuple<RunMode> = ['test', 'dev', 'prod'];
  // // eslint-disable-next-line consistent-return
  // return allModes.find((arrMode) => arrMode === mode);
}

export function getRunMode(defMode?: RunMode): RunMode {
  return getEnvRunMode() ?? defMode ?? 'test';
}
