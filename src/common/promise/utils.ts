/**
 * @module promise
 */

import {
  AnyAsyncFunc, AnyFunc, AwaitReturnType, AwaitType,
} from '../../typescript/utilityTypes';

/**
 * 等待一段时间
 * @param  {Number} time 等待的毫秒数
 * @return {Promise} Promise
 */
export function wait(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 为函数添加重试逻辑
 * @param func 待重试的函数
 * @param times 重试的次数
 * @param time 重试的间隔毫秒数
 * @return 带重试的函数
 */
export function retry<T extends AnyFunc>(
  func: T,
  times = 1,
  time = 0,
): (...args: Parameters<T>) => Promise<AwaitReturnType<T>> {
  return async function retryFunction<This = any>(this: This, ...args: Parameters<T>): Promise<AwaitReturnType<T>> {
    let syncResult: ReturnType<T> | Promise<AwaitReturnType<T>>;
    let asyncResult: AwaitReturnType<T>;

    // 同步函数
    try {
      syncResult = func.apply(this, args) as ReturnType<T>;
    } catch (e) {
      if (times > 0) {
        await wait(time);
        return retry(func, times - 1, time)(...args);
      }

      // 重试次数用尽
      throw e;
    }

    // 异步函数
    if (syncResult instanceof Promise) {
      if (times > 0) {
        try {
          asyncResult = await syncResult;
        } catch (e) {
          await wait(time);
          return retry(func, times - 1, time)(...args);
        }

        return asyncResult;
      }
    }

    return syncResult as AwaitReturnType<T>;
  };
}

/** timeout 函数中标识超时的错误 */
export class TimeoutError extends Error {
  constructor(message = 'timeout') {
    super(message);
  }
}

/**
 * 为函数设置超时
 * @param func 待设置超时的函数
 * @param time 以毫秒为单位的超时时间
 * @param onTimeout 超时时的处理逻辑
 *
 * @returns 带超时的函数
 */
export function timeout<T extends AnyAsyncFunc>(
  func: T,
  time = 0,
  onTimeout = () => Promise.reject(new TimeoutError()),
) {
  return function timeoutFunction<This = any>(this: This, ...args: Parameters<T>): ReturnType<T> {
    const tasks = [func.apply(this, args)];
    if (time > 0) {
      tasks.push(wait(time).then(onTimeout));
    }
    return Promise.race(tasks) as ReturnType<T>;
  };
}

/**
 * 动态的 Promise.all
 * @param array Promise 数组
 * @return 当 array 中所有 Promise 状态都转化为 resolved 后 resolve
 */
export async function dynamicAll<T = any>(array: Promise<T>[]): Promise<T[]> {
  let { length } = array;
  let result: AwaitType<T[]>;
  while (true) {
    result = await Promise.all(array); // eslint-disable-line no-await-in-loop
    if (array.length === length) {
      break;
    }
    length = array.length;
  }
  return result;
}

export enum PromiseActions {
  resolve = 'resolve',
  reject = 'reject',
  pending = 'pending',
  wait = 'wait' /* eslint-disable-line no-shadow */,
}

type DeduplicatedFunction<T extends AnyFunc, A extends PromiseActions, This = any> = (
  this: This,
  ...args: Parameters<T>
) => A extends PromiseActions.resolve
  ? ReturnType<T> | Promise<void>
  : A extends PromiseActions.reject
  ? ReturnType<T>
  : A extends PromiseActions.wait
  ? ReturnType<T>
  : ReturnType<T> | Promise<never>;

/**
 * promise 函数去重
 * @param {Function} func 函数
 * @param {String} action 并行下的行为，可填 'resolve', 'reject', 'pending'
 * @param {Function} getKey 计算去重依据的 key 的函数
 * @return {Function} 有去重功能的 promise 函数
 */
export function deduplicate<T extends AnyFunc>(
  func: T,
  action: PromiseActions = PromiseActions.pending,
  getKey: (args: Parameters<T>) => any = JSON.stringify,
): DeduplicatedFunction<T, typeof action> {
  const pendingMap = new Map<ReturnType<typeof getKey>, true>();
  const resultMap = new Map<ReturnType<typeof getKey>, ReturnType<T>>();

  return function deduplicatedFunction(...params) {
    const key = getKey(params);
    if (pendingMap.get(key)) {
      switch (action) {
        case PromiseActions.resolve:
          return Promise.resolve();
        case PromiseActions.reject:
          return Promise.reject();
        case PromiseActions.wait:
          return resultMap.get(key);
        case PromiseActions.pending:
        default:
          return new Promise(() => undefined);
      }
    }

    const result = func.apply(this, params);
    resultMap.set(key, result);

    if (result instanceof Promise) {
      pendingMap.set(key, true);
      result
        .then(() => {
          pendingMap.delete(key);
          resultMap.delete(key);
        })
        .catch(() => {
          pendingMap.delete(key);
          resultMap.delete(key);
        });
    }

    return result as ReturnType<T>;
  } as DeduplicatedFunction<T, typeof action>;
}

/**
 * 函数仅返回最新结果
 * @param {Function} func 函数
 * @return {Function} 只有最新结果会返回的函数
 */
export function keepUpToDate<T extends AnyFunc>(func: T): (...args: Parameters<T>) => Promise<AwaitReturnType<T>> {
  let newest: null | number = null;
  return async function upToDateFunction<This = any>(
    this: This,
    ...params: Parameters<T>
  ): Promise<AwaitReturnType<T>> {
    newest = Date.now();
    const current = newest;
    const result = (await func.apply(this, params)) as AwaitReturnType<T>;
    // 如果已经不是最新则丢弃结果
    if (current !== newest) return new Promise(() => null);
    newest = null;
    return result;
  };
}
