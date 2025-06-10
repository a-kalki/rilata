/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import { failure } from '../../core/result/failure.js';
import { Module } from './module.js';
import { Result } from '#core/result/types.js';
import { WebModuleController } from '#api/controller/web.m-controller.js';
import { success } from '#core/result/success.js';
import { Executable, ExecutableInput, ModuleConfig, ModuleMeta } from './types.ts';
import { BackendBaseErrors, BadRequestError, InternalError, InvalidInputNameError } from '#api/use-case/errors.ts';
import { RequestScope } from '#core/index.ts';

export abstract class WebModule<META extends ModuleMeta> extends Module<META> {
  constructor(
    protected config: ModuleConfig,
    protected resolvers: META['resolvers'],
    public moduleController: WebModuleController,
    protected executable: Executable[],
  ) {
    super(config, resolvers);
  }

  /** Обеспачиват выполнение сервиса. */
  async handleRequest(
    input: unknown,
    reqScope: RequestScope,
  ): Promise<Result<BackendBaseErrors, unknown>> {
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
      return executable.execute(inputDto, reqScope);
    } catch (e) {
      return this.catchRunModeError(input, reqScope, e as Error);
    }
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
