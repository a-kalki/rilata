import { ServerConfig } from '../types.ts';

export type BunServerConfig = ServerConfig & {
  localHost: 'localhost',
  localPort: 3000,
  loggerModes: 'all',
  serverName: 'default-server',
};
