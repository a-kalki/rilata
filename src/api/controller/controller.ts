import { Urls } from '#api/module/types.ts';

export interface Controller {
  execute(req: Request): Promise<unknown>

  getUrls(): Urls
}
