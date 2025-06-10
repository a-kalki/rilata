/* eslint-disable @typescript-eslint/no-unused-vars */
import { UCMeta } from '#core/app-meta.ts';
import { BackendResult, BackendResultDTO } from '#core/contract.ts';
import { BadRequestError } from '#core/errors.ts';
import { failure } from '#core/result/failure.ts';
import { success } from '#core/result/success.ts';
import { Result } from '#core/result/types.ts';

export class BackendApi {
  constructor(protected moduleUrl: string) {}

  /** делает запрос в бэкенд и возвращает результат.
    @param {Object} requestDod - объект типа RequestDod */
  async request<META extends UCMeta>(
    requestDod: META['in'],
    ...args: unknown[]
  ): Promise<BackendResult<UCMeta>> {
    try {
      const backendResult = await fetch(this.moduleUrl, this.getRequestBody(requestDod));
      const resultDto = await backendResult.json();
      return this.resultDtoToResult(resultDto);
    } catch (e) {
      const err = e as Error;
      if (err.message === 'Failed to fetch') {
        return failure({
          name: 'Network error',
          type: 'app-error',
        });
      }

      return failure({
        name: 'Bad request error',
        type: 'app-error',
      });
    }
  }

  getRequestBody(payload: unknown, ...args: unknown[]): Record<string, unknown> {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    };
  }

  protected resultDtoToResult<M extends UCMeta>(resultDto: BackendResultDTO<M>): BackendResult<M> {
    if (resultDto.success === false) {
      return failure(resultDto.payload);
    }
    if (resultDto.success === true) {
      return success(resultDto.payload);
    }
    return this.notResultDto(resultDto);
  }

  protected notResultDto(value: unknown): Result<BadRequestError, never> {
    // eslint-disable-next-line no-console
    console.error('response value is not resultDto', value);
    return failure({
      name: 'Bad request error',
      type: 'app-error',
    });
  }
}
