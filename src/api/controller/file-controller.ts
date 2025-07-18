import { join } from 'node:path';
import { Controller } from './controller.ts';
import { ResponseFileOptions } from '../utils/response/types.ts';
import { responseUtility } from '../utils/response/response-utility.ts';

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
