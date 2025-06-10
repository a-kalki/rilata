import { RilataRequest } from '#api/controller/types.js';
import { ServerAfterware } from '../server-afterware.ts';

export class LogResponseAfterware extends ServerAfterware {
  process(req: RilataRequest, resp: Response): Response {
    const method = `${req.method}`.padEnd(8);
    const path = `${new URL(req.url).pathname}`.padEnd(30);
    const msg = `${method}${path}${resp.status}`;
    this.resolver.logger.info(msg);
    return resp;
  }
}
