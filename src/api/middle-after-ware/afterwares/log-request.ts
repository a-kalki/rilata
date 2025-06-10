import { RilataRequest } from '#api/controller/types.ts';
import { Logger } from '#api/logger/logger.ts';
import { ServerAfterware } from '../server-afterware.ts';

export class LogResponseAfterware extends ServerAfterware {
  constructor(protected logger: Logger) {
    super();
  }

  process(req: RilataRequest, resp: Response): Response {
    const method = `${req.method}`.padEnd(8);
    const path = `${new URL(req.url).pathname}`.padEnd(30);
    const msg = `${method}${path}${resp.status}`;
    this.logger.info(msg);
    return resp;
  }
}
