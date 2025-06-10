import { RunMode } from '#core/index.ts';
import { TelegramApi } from '#core/utils/telegram-api/telegram-api.js';
import { BotLoggerConfig, SendMessage } from '#core/utils/telegram-api/types.js';
import { BaseLogger } from './base-logger.ts';
import { LoggerModes } from './logger-modes.ts';

const blockCode = '```';

export class BotLogger extends BaseLogger {
  protected telegramApi: TelegramApi;

  constructor(logMode: LoggerModes, runMode: RunMode, protected config: BotLoggerConfig) {
    super(logMode);
    this.telegramApi = new TelegramApi(config.token, runMode, this);
  }

  sendToBot(text: string, options?: Partial<SendMessage>): void {
    this.config.managerIds.forEach((managerId) => {
      this.telegramApi.postRequest({
        method: 'sendMessage',
        text,
        chat_id: managerId,
        ...options,
      });
    });
  }

  protected toLog(text: string, logAttrs?: unknown): void {
    if (logAttrs === undefined) {
      this.sendToBot(text);
    } else {
      this.sendToBot(
        `${text}\n${blockCode}\n${JSON.stringify(logAttrs, null, 2)}\n${blockCode}`,
        { parse_mode: 'Markdown' },
      );
    }
  }

  protected checkInvariants(): void {
    if (this.config.managerIds.length === 0) {
      // eslint-disable-next-line no-console
      console.log('not setted manager ids for bot logger', { config: this.config });
      throw Error('not setted manager ids for bot logger');
    }
  }
}
