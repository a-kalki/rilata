import { BackendResult } from '../../core/contract.ts';
import { BadRequestError, InternalError, InvalidInputNameError } from '../../core/errors.ts';
import { failure } from '../../core/result/failure.ts';
import { success } from '../../core/result/success.ts';
import { Result } from '../../core/result/types.ts';
import { WebModuleController } from '../controller/web.m-controller.ts';
import { Module } from './module.ts';
import { Executable, ExecutableInput, ModuleConfig, ModuleMeta, RequestScope, Urls } from './types.ts';

export abstract class WebModule<META extends ModuleMeta> extends Module<META> {
  protected controller: WebModuleController;

  constructor(
    protected config: ModuleConfig,
    protected resolvers: META['resolvers'],
    protected executable: Executable[],
  ) {
    super(config, resolvers);
    this.controller = new WebModuleController(this);
    executable.forEach((e) => e.init(resolvers));
  }

  getUrls(): Urls {
    return this.config.moduleUrls;
  }

  /** Обеспачиват выполнение сервиса. */
  async handleRequest(
    input: unknown,
    reqScope: RequestScope,
  ): Promise<BackendResult> {
    try {
      const checkResult = this.checkInputData(input);
      if (checkResult.isFailure()) {
        return checkResult;
      }
      const inputDto = checkResult.value;
      const executable = this.getExecutable(inputDto.name);
      if (!executable) {
        return this.notFindedServiceError();
      }
      return executable.execute(inputDto, reqScope) as unknown as BackendResult;
    } catch (e) {
      return this.catchRunModeError(input, reqScope, e as Error);
    }
  }

  getController(): WebModuleController {
    return this.controller;
  }

  protected getExecutable(inputName: string): Executable | undefined {
    const executable = this.executable.find((e) => e.inputName === inputName);
    if (!executable) {
      const errStr = `Не найден обработчик (use case) для запроса ${inputName} в модуле ${this.name}`;
      this.getLogger().warning(errStr);
      return undefined;
    }
    return executable;
  }

  protected catchRunModeError(
    inputDod: unknown, reqScope: RequestScope, e: Error,
  ): Result<InternalError, never> {
    if (this.getServerResolver().runMode.includes('test')) {
      throw e;
    }

    this.getLogger().fatalError(
      `server internal error in module: ${this.name}`,
      { inputDod, requestScope: reqScope },
      e,
    );
    return failure({ name: 'Internal error', type: 'app-error' });
  }

  protected checkInputData(input: unknown): Result<BadRequestError, ExecutableInput> {
    if (typeof input !== 'object' || input === null) {
      return this.getBadRequestErr();
    }

    const { name, requestId, attrs } = input as Record<string, unknown>;
    const nameIsNotValid = name === undefined || typeof name !== 'string';
    const requestIdIsNotValid = requestId === undefined || typeof requestId !== 'string';
    const attrsIsNotValid = attrs === undefined || typeof attrs !== 'object';

    if (nameIsNotValid || requestIdIsNotValid || attrsIsNotValid) {
      return this.getBadRequestErr();
    }
    return success(input as ExecutableInput);
  }

  protected notFindedServiceError(): Result<InvalidInputNameError, never> {
    return failure({
      name: 'Invalid input name error',
      type: 'app-error',
    });
  }

  protected getBadRequestErr(): Result<BadRequestError, never> {
    const err: BadRequestError = {
      name: 'Bad request error',
      type: 'app-error',
    };
    return failure(err);
  }
}
