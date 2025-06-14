/* eslint-disable @typescript-eslint/no-unused-vars */

import { UCMeta } from '../../core/app-meta.ts';
import { BackendResult, BackendResultByMeta, BackendResultDTO } from '../../core/contract.ts';
import { JwtDecoder } from '../../core/jwt/jwt-decoder.ts';
import { JwtDto } from '../../core/jwt/types.ts';
import { failure } from '../../core/result/failure.ts';
import { success } from '../../core/result/success.ts';

export abstract class BackendApi {
  protected abstract accessToken?: string;

  protected abstract refreshToken?: string;

  protected abstract updateAccessToken(): Promise<void>;

  constructor(protected moduleUrl: string, protected jwtDecoder: JwtDecoder<JwtDto>) {}

  /** делает запрос в бэкенд и возвращает результат.
    @param {Object} dto - объект типа RequestDod */
  async request<META extends UCMeta>(dto: META['in'], ...args: unknown[]): Promise<BackendResultByMeta<META>> {
    const token = this.accessToken;
    try {
      if (token && this.jwtDecoder.dateIsExpired(token)) {
        const { refreshToken } = this;
        if (!refreshToken || this.jwtDecoder.dateIsExpired(refreshToken)) {
          return failure({
            name: 'Token expired error',
            type: 'app-error',
          });
        }
        await this.updateAccessToken();
      }

      const backendResult = await fetch(this.moduleUrl, this.getRequestBody(dto));
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
    const { accessToken: token } = this;
    const auth = token ? { Authorization: `Bearer ${token}` } : {};
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...auth,
      },
      body: JSON.stringify(payload),
    };
  }

  protected resultDtoToResult(resultDto: BackendResultDTO): BackendResult {
    if (resultDto.success === false) {
      return failure(resultDto.payload);
    }
    if (resultDto.success === true) {
      return success(resultDto.payload);
    }
    return failure({
      name: 'Bad request error',
      type: 'app-error',
    });
  }
}
