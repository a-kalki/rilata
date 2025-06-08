import { BotSubscribeMode } from './bot-types.ts';
import { BotModule } from './bot.module.ts';
import { ModuleResolveRRRR } from './m-resolves.ts';

export type BotModuleResolves<M extends BotModule> = ModuleResolveRRRR<M> & {
  botToken: string,
  botSubscribeMode: BotSubscribeMode,
}
