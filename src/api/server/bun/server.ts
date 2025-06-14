/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { Serve, Server as BUNServer } from 'bun';
import { BunServerConfig } from './types.ts';
import { ServerMeta } from '../types.ts';
import { Server } from '../server.ts';
import { ServerMiddleware } from '../../middle-after-ware/server-middleware.ts';
import { ServerAfterware } from '../../middle-after-ware/server-afterware.ts';
import { Controller } from '../../controller/controller.ts';
import { Module } from '../../module/module.ts';
import { ModuleMeta } from '../../module/types.ts';
import { RilataRequest } from '../../controller/types.ts';
import { NotFoundError } from '../../../core/errors.ts';
import { DTO } from '../../../core/types.ts';
import { ResultDTO } from '../../../core/contract.ts';
import { responseUtility } from '../../utils/response/response-utility.ts';

export abstract class BunServer<META extends ServerMeta> extends Server<META> {
  protected abstract middlewares: ServerMiddleware[];

  protected abstract afterwares: ServerAfterware[];

  protected abstract serverControllers: Controller[];

  protected stringUrls: Record<string, Controller> = {};

  protected regexUrls: [RegExp, Controller][] = [];

  protected bunServer: BUNServer | undefined;

  constructor(
    protected config: BunServerConfig,
    protected resolver: META['resolver'],
    protected modules: Module<ModuleMeta>[],
  ) { super(config, resolver, modules); }

  stop(): void {
    if (this.bunServer !== undefined) this.bunServer.stop();
    const { localPort, localHost } = this.config;
    this.resolver.logger.info(`Http Bun server stopped by address: ${localHost}:${localPort}`);
    super.stop();
  }

  protected startServer(): void {
    this.setControllerUrls();
    const { localPort, localHost } = this.config;
    this.fetch = this.fetch.bind(this);
    this.bunServer = Bun.serve(this as unknown as Serve<unknown>);
    this.resolver.logger.info(`Http Bun server runned by address: ${localHost}:${localPort}`);
  }

  async fetch(req: Request): Promise<Response> {
    try {
      const middlewaresResult = this.processMiddlewares(req);
      if (middlewaresResult !== undefined) {
        return this.processAfterware(req, middlewaresResult);
      }

      const controller = this.getControllerByUrlPath(req);

      if (controller) {
        const result = await controller.execute(req);
        const resp = result instanceof Response ? result : new Response('success', { status: 200 });
        return this.processAfterware(req, resp);
      }

      const errResp = this.getNotFoundError();
      return this.processAfterware(req, errResp);
    } catch (e) {
      if (this.resolver.runMode === 'test') throw e;
      const errResp = this.getInternalError(req, e as Error);
      return this.processAfterware(req, errResp);
    }
  }

  protected getControllerByUrlPath(req: Request): Controller | undefined {
    const path = new URL(req.url).pathname;
    const controller = this.stringUrls[path];
    if (controller) return controller;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tuple = this.regexUrls.find(([regex, _]) => regex.test(path));
    if (tuple) return tuple[1];
    return undefined;
  }

  protected setControllerUrls(): void {
    this.stringUrls = {};
    this.regexUrls = [];

    const controllers = this.serverControllers;
    this.modules.forEach((module) => controllers.push(module.getController()));
    controllers.forEach((controller) => {
      controller.getUrls().forEach((url) => {
        if (typeof url === 'string') this.stringUrls[url] = controller;
        else this.regexUrls.push([url, controller]);
      });
    });
  }

  protected processMiddlewares(req: Request): Response | undefined {
    // eslint-disable-next-line no-restricted-syntax
    for (const middleware of this.middlewares) {
      const response = middleware.process(req as RilataRequest);
      if (response !== undefined) return response;
    }
    return undefined;
  }

  protected processAfterware(req: Request, resp: Response): Response {
    let retResp = resp;
    // eslint-disable-next-line no-restricted-syntax
    for (const afterware of this.afterwares) {
      retResp = afterware.process(req as RilataRequest, retResp);
    }
    return retResp;
  }

  protected getNotFoundError(): Response {
    const err: NotFoundError = {
      name: 'Not found error',
      type: 'app-error',
    };
    return this.getFailure(err, 404);
  }

  protected getInternalError(req: Request, e: Error): Response {
    const clone = req.clone();
    this.resolver.logger.error(String(e), { url: clone.url, body: clone.json() }, e as Error);

    const data = this.resolver.runMode === 'development'
      ? {
        error: (e as Error)?.message ?? 'not handled error',
        stack: (e as Error)?.stack ?? 'no stack trace',
      }
      : {
        name: 'Internal error',
        type: 'app-error',
      };
    return this.getFailure(data, 500);
  }

  protected getFailure(err: DTO, status: number): Response {
    const resultDto: ResultDTO<DTO, never> = {
      httpStatus: status,
      success: false,
      payload: err,
    };
    return responseUtility.createJsonResponse(resultDto, status);
  }
}
