import { RilataRequest } from '../controller/types.js';
import { ServerResolver } from '../server/types.js';

export abstract class ServerMiddleware {
  constructor(protected resolver: ServerResolver) {}

  /**
    Предварительная обработка всех запросов.
    Если вернет Response, то ответ получен и запрос дальше не пойдет.
  */
  abstract process(req: RilataRequest): Response | undefined
}
