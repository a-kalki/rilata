/**
 * Преобразует кортеж в объект с числовыми ключами
 * Пример: ['a', 'b'] => {0: 'a', 1: 'b'}
 */
export type TupleToObject<T extends readonly any[]> = {
  [K in keyof T & `${number}`]: T[K] 
};

/**
 * Преобразует кортеж в объект с заданными именами свойств
 * Пример: 
 * TupleToObjectWithPropNames<['a', 'b'], {0: 'name', 1: 'age'}> 
 * => {name: 'a', age: 'b'}
 */
export type TupleToObjectWithPropNames<
  T extends readonly any[],
  Names extends Record<keyof TupleToObject<T>, PropertyKey>,
> = {
  [K in keyof TupleToObject<T> as Names[K]]: T[K]
};

/** Удаляет первый элемент из кортежа */
export type RemoveFirstFromTuple<T extends any[]> = 
  T extends [any, ...infer R] ? R : [];

/** Преобразует union type в кортеж */
export type UnionToTuple<T> = 
  [T] extends [never] ? [] :
  T extends any ? [T, ...UnionToTuple<Exclude<T, T>>] : never;

/** Преобразует кортеж в union его элементов */
export type TupleToUnion<T> =
  T extends readonly (infer U)[] ? U : never;
