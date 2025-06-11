import { RilataRequest } from '../controller/types.ts';

export abstract class ServerAfterware {
  /** Постобработка всех запросов. */
  abstract process(req: RilataRequest, resp: Response): Response
}
