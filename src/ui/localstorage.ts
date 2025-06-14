/* eslint-disable consistent-return */
export const localStore = {
  set<T>(key: string, value: T): void {
    if (typeof value !== 'string') {
      console.log('value: ', value);
      throw Error('not string')
    }
    localStorage.setItem(key, JSON.stringify(value));
  },

  get<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);
    if (!item) return;
    try {
      return JSON.parse(item) as T;
    } catch {
      return undefined;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },
};
