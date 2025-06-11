import {
  describe, expect, spyOn, test,
} from 'bun:test';
import { BunJwtDecoder } from './jwt-decoder.ts';
import { BunJwtVerifier } from './jwt-verifier.ts';
import { BunJwtCreator } from './jwt-creator.ts';
import { UserId } from '../../../core/types.ts';
import { JwtConfig } from '../../server/types.ts';
import { uuidUtility } from '../../utils/uuid/uuid-utility.ts';
import { JwtDecodeErrors, JwtVerifyErrors } from '../../../core/jwt-errors.ts';

type TestJwtPayload = {
  userId: UserId,
};

const jwtExpiredTime = new Date('1970-01-26T23:25:55.302Z').getTime(); // 2244355302
const refreshJwtExpiredTime = new Date('1970-01-28T23:25:55.302Z').getTime(); // 2417155302
const jwtSecret = 'your-256-bit-secret';
const jwtConfig: JwtConfig = {
  algorithm: 'HS256',
  jwtLifetimeAsHour: 24,
  jwtRefreshLifetimeAsHour: 24 * 3,
};

class TestJwtDecoder extends BunJwtDecoder<TestJwtPayload> {
  constructor(public expiredTimeShiftAsMs: number) {
    super();
  }

  payloadBodyIsValid(payload: TestJwtPayload): boolean {
    return uuidUtility.isValidValue(payload.userId);
  }

  getNow(): number {
    return jwtExpiredTime - 2000; // tokenTime - 2 second;
  }
}

const expiredTimeShiftAsMs = 0;
const backendDecoder = new TestJwtDecoder(expiredTimeShiftAsMs);
const creator = new BunJwtCreator<TestJwtPayload>(jwtSecret, jwtConfig, backendDecoder);
const verifier = new BunJwtVerifier<TestJwtPayload>(jwtSecret, jwtConfig, backendDecoder);

const incorectTokenError: JwtDecodeErrors = {
  type: 'app-error',
  name: 'Incorrect token error',
};
const correctToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDIsInR5cCI6ImFjY2VzcyJ9.JMAJlarkXQ-Za9FVpJdt42r0iv8GcE6vg81d9kxRVog';
const incorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cc2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDIsInR5cCI6ImFjY2VzcyJ9.JMAJlarkXQ-Za9FVpJdt42r0iv8GcE6vg81d9kxRVog';

describe('all jwt tests', () => {
  describe('decode jwt tests', () => {
    test('Успех, получена полезная нагрузка с токена', () => {
      const result = backendDecoder.getTokenPayload(correctToken);
      expect(result.isSuccess()).toBe(true);
      const payloadValue = result.value as TestJwtPayload;
      expect(payloadValue.userId).toBe('536e7463-b24d-4e7b-bad9-2bd2ed8011fd');
      expect(Object.keys(payloadValue)).toEqual(['userId']);
    });

    test('Провал, тело токена невалидно.', () => {
      const payload = backendDecoder.getTokenPayload(incorrectToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as JwtDecodeErrors).toEqual(incorectTokenError);
    });

    test('Провал, тело токена невалидно - дата истечения не является числом', () => {
      const expIncorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOiIyMjQ0czU1MzAyIiwidHlwIjoiYWNjZXNzIn0.PtT9E3rkntF4-u8osWisrnTfBjkSVvEnH3PBlFhUby8';
      const payload = backendDecoder.getTokenPayload(expIncorrectToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as JwtDecodeErrors).toEqual(incorectTokenError);
    });

    test('Провал, тело токена невалидно - поле типа токена не валидно', () => {
      const refreshIncorrectToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQ1NTMwMiwidHlwIjoiYWNjZXMifQ.c84pXgs-mkkz7_Qeiq3HZmYHyUt-h2fJfwitjetG_XM';
      const payload = backendDecoder.getTokenPayload(refreshIncorrectToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as JwtDecodeErrors).toEqual(incorectTokenError);
    });

    test('Провал, тело токена невалидно - по валидации тела токена', () => {
      const notValidPayloadToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2LWIyNGQtNGU3Yi1iYWQ5LTJiZDJlZDgwMTFmZCIsImV4cCI6MjI0NDM1NTMwMiwidHlwIjoiYWNjZXNzIn0.vw2WkOGp8KZJ6bdtGsKRxiS5cFu8CtBafMvr0abdSgU';
      const payload = backendDecoder.getTokenPayload(notValidPayloadToken);
      expect(payload.isFailure()).toBe(true);
      expect(payload.value as JwtDecodeErrors).toEqual({
        name: 'Not valid token payload error',
        type: 'app-error',
      });
    });

    describe('time expired tests', () => {
      test('Провал, время токена истекло', () => {
        spyOn(backendDecoder, 'getNow').mockReturnValueOnce(jwtExpiredTime + 10);
        const payload = backendDecoder.getTokenPayload(correctToken);
        expect(payload.isFailure()).toBe(true);
        expect(payload.value as JwtDecodeErrors).toEqual({
          name: 'Token expired error',
          type: 'app-error',
        });
      });

      test('Провал, время токена истекло - случай для фронта с timeshift равной 3 секунды', () => {
        const frontendDecoder = new TestJwtDecoder(3000); // frontend jwt expired timeshift 3000 ms
        const payload = frontendDecoder.getTokenPayload(correctToken);
        expect(payload.isFailure()).toBe(true);
        expect(payload.value as JwtDecodeErrors).toEqual({
          type: 'app-error',
          name: 'Token expired error',
        });
      });
    });

    describe('refresh token tests', () => {
      const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjI0MTcxNTUzMDIsInR5cCI6InJlZnJlc2gifQ.oRmLhBnREiTzVn7fuW3M6Fo4jR3nIrgBHgO3bAyZti0';

      test('успех, время рефреш токена не истекло', () => {
        // эмулирует время после истечения срока действия access токена (на всякий случай)
        const getNowMock = spyOn(backendDecoder, 'getNow').mockReturnValueOnce(jwtExpiredTime + 1000);
        getNowMock.mockClear();
        const result = backendDecoder.getTokenPayload(refreshToken);
        expect(result.isSuccess()).toBe(true);
        expect(result.value as TestJwtPayload).toEqual({
          userId: '536e7463-b24d-4e7b-bad9-2bd2ed8011fd',
        });
        expect(getNowMock).toHaveBeenCalledTimes(1);
      });

      test('провал, время рефреш токена истекло', () => {
        const getNowMock = spyOn(backendDecoder, 'getNow').mockReturnValueOnce(refreshJwtExpiredTime + 10);
        getNowMock.mockClear();
        const result = backendDecoder.getTokenPayload(correctToken);
        expect(result.isFailure()).toBe(true);
        expect(result.value as JwtDecodeErrors).toEqual({
          type: 'app-error',
          name: 'Token expired error',
        });
        expect(getNowMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('create jwt tests', () => {
    test('успех, токен создан успешно', () => {
      const jwtLifeTimeAsMs = jwtConfig.jwtLifetimeAsHour * 60 * 60 * 1000;
      const getNowMock = spyOn(backendDecoder, 'getNow').mockReturnValueOnce(jwtExpiredTime - jwtLifeTimeAsMs);
      getNowMock.mockClear();
      const jwt = creator.createToken({ userId: '536e7463-b24d-4e7b-bad9-2bd2ed8011fd' }, 'access');
      expect(jwt).toBe(correctToken);
      expect(getNowMock).toHaveBeenCalledTimes(1);

      const payloadResult = backendDecoder.getTokenPayload(jwt);
      expect(payloadResult.isSuccess()).toBeTrue();
      expect(payloadResult.value).toEqual({ userId: '536e7463-b24d-4e7b-bad9-2bd2ed8011fd' });
      expect(getNowMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('verify jwt tests', () => {
    test('успех, верификация access прошла усешно', () => {
      const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDIsInR5cCI6InJlZnJlc2gifQ.hqUjb_WCnBqiNDrtH8Pkn7RsKAbgFEyrDkJKXz48wrU';
      const verifyResult = verifier.verifyToken(refreshToken);
      expect(verifyResult.isSuccess()).toBeTrue();
      expect(verifyResult.value).toEqual({ userId: '536e7463-b24d-4e7b-bad9-2bd2ed8011fd' });
    });

    test('успех, верификация refresh прошла усешно', () => {
      const verifyResult = verifier.verifyToken(correctToken);
      expect(verifyResult.isSuccess()).toBeTrue();
      expect(verifyResult.value).toEqual({ userId: '536e7463-b24d-4e7b-bad9-2bd2ed8011fd' });
    });

    test('провал, верификация прошла неуспешно', () => {
      const verifyResult = verifier.verifyToken(incorrectToken);
      expect(verifyResult.isFailure()).toBeTrue();
      expect((verifyResult.value as JwtVerifyErrors).name).toBe('Jwt verify error');
    });

    test('провал, верификация прошла неусешно по секретному ключу', () => {
      // token generated by secret key = 'your-256-bit-secre'. Valid key = 'your-256-bit-secret'
      const incorrectTokenBySecretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MzZlNzQ2My1iMjRkLTRlN2ItYmFkOS0yYmQyZWQ4MDExZmQiLCJleHAiOjIyNDQzNTUzMDIsInR5cCI6ImFjY2VzcyJ9.6yTj1JMXATmmyzUKCOVUVWULtNCGRWv1hNe2ues6eic';
      const verifyResult = verifier.verifyToken(incorrectTokenBySecretKey);
      expect(verifyResult.isFailure()).toBeTrue();
      expect((verifyResult.value as JwtVerifyErrors).name).toBe('Jwt verify error');
    });
  });
});
