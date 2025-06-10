import { RilataRequest } from '#api/http.index.ts';
import { ServerResolver } from '#api/server/types.ts';

export abstract class ServerAfterware {
  constructor(protected resolver: ServerResolver) {}

  /** Постобработка всех запросов. */
  abstract process(req: RilataRequest, resp: Response): Response
}
