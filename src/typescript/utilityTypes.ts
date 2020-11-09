/** 任意函数 */
export type AnyFunc = (...args: any) => any;
/** 任意 async 函数 */
export type AnyAsyncFunc = (...args: any) => PromiseLike<any>;
/** 返回 T 类型的 then 的类型 */
export type ThenType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : never;
/** 返回 T 类型上 K 属性的类型 */
export type PropType<T, K extends keyof T> = T[K];
/** 使用 await 引用 T 时的返回值 */
export type AwaitType<T> = T extends PromiseLike<infer U> ? U : T;
/** 使用 await 调用 T 时的返回值 */
export type AwaitReturnType<T extends AnyFunc> = AwaitType<ReturnType<T>>;
/** 数组 T 的元素的类型 */
export type EleType<T extends any[]> = T extends (infer U)[] ? U : never;
