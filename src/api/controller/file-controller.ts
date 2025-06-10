import { join } from 'node:path';
import { responseUtility } from '../../core/utils/response/response-utility.js';
import { Controller } from './controller.js';
import { ResponseFileOptions } from '#core/utils/response/types.ts';

export abstract class FileController implements Controller {
  constructor(protected projectPath: string) {}

  abstract getUrls(): string[] | RegExp[]

  protected abstract filePath: string;

  protected abstract fileOptions?: ResponseFileOptions;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(req: Request): Promise<Response> {
    const path = join(this.projectPath, this.filePath);
    return responseUtility.createFileResponse(path, this.fileOptions);
  }
}
