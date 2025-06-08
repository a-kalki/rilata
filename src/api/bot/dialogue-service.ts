/* eslint-disable no-underscore-dangle */
import { Update } from '@grammyjs/types';
import { BotState } from './state.js';
import { DialogueContext, GeneralBotMiddleware } from './types.js';
import { BotDialogueRepository } from './dialogue-repo.js';
import { updateUtils } from './utils/update.ts';
import { Constructor, MaybePromise } from '#core/types.js';
import { DTO } from '#domain/dto.js';
import { Service } from '#api/service/uc.js;
import { GeneralModuleResolver } from '#api/module/types.js';
import { TelegramApi } from '#core/utils/telegram-api/telegram-api.js';
import { ApiMethodNames, ApiMethodsParams, BotReplyMessage, SendMessage } from '#core/utils/telegram-api/types.js';

export abstract class BotDialogueService extends Service<GeneralModuleResolver> {
  protected abstract stateCtors: Constructor<BotState>[];

  protected abstract middlewareCtors: Constructor<GeneralBotMiddleware>[];

  protected states!: BotState[];

  protected middlewares!: GeneralBotMiddleware[];

  protected telegramApi!: TelegramApi;

  init(resolver: GeneralModuleResolver): void {
    super.init(resolver);
    this.states = this.stateCtors.map((Ctor) => new Ctor());
    this.states.forEach((state) => state.init(this.moduleResolver, this));
    this.middlewares = this.middlewareCtors.map((Ctor) => new Ctor());
    this.middlewares.forEach((m) => m.init(this.moduleResolver, this));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.telegramApi = new TelegramApi((resolver.getModuleResolves() as any).botToken);
  }

  async execute(update: Update): Promise<BotReplyMessage> {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const middleware of this.middlewares) {
        // eslint-disable-next-line no-await-in-loop
        const result = await middleware.process(update);
        if (result) return result;
      }

      const telegramId = updateUtils.getUserId(update);
      const context = this.findContext(telegramId);
      const stateName = context ? context.stateName : 'initialState';

      return await this.getState(stateName).execute(update);
    } catch (e) {
      return this.processCatch(update, e as Error);
    }
  }

  async sendByBot(promise: MaybePromise<ApiMethodsParams<ApiMethodNames>>): Promise<Response> {
    return this.telegramApi.postRequest(await promise);
  }

  getState<S extends BotState>(stateName: S['stateName']): S {
    const state = this.states.find((s) => s.stateName === stateName);
    if (!state) {
      throw this.moduleResolver.getLogger().error(`not finded state by name: ${stateName}`);
    }
    return state as S;
  }

  findContext<C extends DialogueContext<DTO, string>>(telegramId: string): C | undefined {
    const dialogueRepo = BotDialogueRepository.instance<
      false, DialogueContext<DTO, string>
    >(this.moduleResolver);
    return dialogueRepo.findActive(telegramId) as C;
  }

  protected processCatch(update: Update, err: Error): BotReplyMessage {
    const chatId = updateUtils.getUserId(update);
    const context = this.findContext(chatId);
    this.moduleResolver.getLogger().error(err.message, { update, context }, err);
    const msg: SendMessage = {
      method: 'sendMessage',
      chat_id: chatId,
      text: 'К сожалению произошла непредвиденная ошибка. Попробуйте еще раз. Если ошибка будет повторяться, то рекомендуем завершить текущий диалог через команду /cancel и начать тест заново.',
    };
    return msg;
  }
}
