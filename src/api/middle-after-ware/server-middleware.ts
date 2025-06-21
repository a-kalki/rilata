import { MaybePromise } from '../../core/types.ts';
import { RilataRequest } from '../controller/types.ts';

export abstract class ServerMiddleware {
  /**
    Предварительная обработка всех запросов.
    Если вернет Response, то ответ получен и запрос дальше не пойдет.
  */
  abstract process(req: RilataRequest): MaybePromise<Response | undefined>
}
