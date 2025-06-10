export type UserStoryMeta = {
  name: string;
  description: string;
  actor: string; // пользователь, роль
  goal: string; // зачем это делается
  useCases: string[];
}
