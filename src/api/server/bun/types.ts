import { ServerConfig } from '../types.ts';

export type BunServerConfig = ServerConfig & {
  localHost: string,
  localPort: number,
  maxUploadFileSizeByte: number,
};
