import { Result } from './types.ts';
import { Failure } from './failure.ts';

export class Success<F, S> {
  readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  isFailure(): this is Failure<F, S> {
    return false;
  }

  isSuccess(): this is Success<F, S> {
    return true;
  }

  toObject(): Record<string, unknown> {
    return {
      isFailure: false,
      isSuccess: true,
      value: this.value,
    };
  }
}

export const success = <F, S>(a: S): Result<F, S> => new Success<F, S>(a);
