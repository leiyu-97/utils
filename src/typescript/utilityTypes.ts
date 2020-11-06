/** 返回 T 类型的 then 的类型 */
export type ThenType<T> = T extends PromiseLike<infer U> ? U : T;
/** 返回 T 类型上 K 属性的类型 */
export type PropType<T, K extends keyof T> = T[K]
