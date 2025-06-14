import { RilataRequest } from '../../controller/types.ts';
import { Logger } from '../../logger/logger.ts';
import { ServerAfterware } from '../server-afterware.ts';

export class LogResponseAfterware extends ServerAfterware {
  constructor(protected logger: Logger) {
    super();
  }

  process(req: RilataRequest, resp: Response): Response {
    // асинхронно ставим в лог
    (async (): Promise<void> => {
      let commandName = '';

      try {
        const { pathname } = new URL(req.url);
        if (pathname.startsWith('/api')) {
          const clone = req.clone(); // req.body можно читать только один раз
          const json = await clone.json();
          if (typeof json?.name === 'string') {
            commandName = `: [${json.name}]`;
          }
        }
      } catch (err) {
        // Игнорируем ошибки парсинга
      }

      const method = `${req.method}`.padEnd(8);
      const path = `${new URL(req.url).pathname}${commandName}`.padEnd(50);
      const msg = `${method}${path}${resp.status}`;
      this.logger.info(msg);
    })();

    return resp;
  }
}
