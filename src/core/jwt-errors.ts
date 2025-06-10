type IncorrectTokenError = {
  name: 'Incorrect token error',
  description?: 'Генерируется когда невозможно расшифровать токен. Токен имеет не верный формат',
  type: 'app-error',
};

type NotValidTokenPayloadError = {
    name: 'Not valid token payload error',
    description?: 'Генерируется когда невалидная полезная нагрузка в токене',
    type: 'app-error',
};

type TokenExpiredError = {
    name: 'Token expired error',
    description?: 'Генерируется когда токен просрочен',
    type: 'app-error',
};

export type JwtDecodeErrors =
  IncorrectTokenError
  | NotValidTokenPayloadError
  | TokenExpiredError

type JwtVerifyError = {
    description?: 'Генерируется когда процесс верификации токена прошел неудачно',
    type: 'app-error',
    name: 'Jwt verify error',
};

export type JwtVerifyErrors = JwtDecodeErrors | JwtVerifyError;
