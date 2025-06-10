import { RilataRequest } from '#api/controller/types.ts';

export abstract class ServerAfterware {
  /** Постобработка всех запросов. */
  abstract process(req: RilataRequest, resp: Response): Response
}
