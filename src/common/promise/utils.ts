/**
 * @module promise
 */

import {
  AnyAsyncFunc, AnyFunc, AwaitReturnType, AwaitType, EleType,
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
  return async function (...args: Parameters<T>): Promise<AwaitReturnType<T>> {
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
  return function (...args: Parameters<T>): ReturnType<T> {
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
export async function dynamicAll(array: Promise<any>[]): Promise<EleType<typeof array>> {
  let { length } = array;
  let result: AwaitType<EleType<typeof array>>;
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
  wait = 'wait', /* eslint-disable-line no-shadow */
}

/**
 * 禁止函数并行执行
 * @param {Function} func 函数
 * @param {String} action 并行下的行为，可填 'resolve', 'reject', 'pending'
 * @return {Any} 函数返回结果
 */
export function noParallel<T extends AnyFunc>(
  func: T,
  action: PromiseActions = PromiseActions.pending,
): (...args: Parameters<typeof func>) => ReturnType<typeof func> | Promise<void> {
  let pending = false;
  let result = null;
  return function (...params: Parameters<typeof func>): ReturnType<typeof func> | Promise<void> {
    if (pending) {
      switch (action) {
        case PromiseActions.resolve:
          return Promise.resolve();
        case PromiseActions.reject:
          return Promise.reject();
        case PromiseActions.pending:
          return new Promise(() => undefined);
        case PromiseActions.wait:
          return result;
        default:
          return undefined;
      }
    }
    pending = true;
    result = func.apply(this, params);

    if (result instanceof Promise) {
      result.then(() => {
        pending = false;
      });
      return result;
    }

    pending = false;
    return result;
  };
}
