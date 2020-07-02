/**
 * @module promise
 */

/**
 * @static
 * @summary 等待一段时间
 * @param  {Number} time 等待的毫秒数
 * @return {Promise} Promise
 */
function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * @static
 * @summary 为函数添加重试逻辑
 * @param {Function} func 待重试的函数
 * @param  {Number} times 重试的次数
 * @param  {Number} time 重试的间隔毫秒数
 * @return {Function} 带重试的函数
 */
function retry(func, times = 1, time = 0) {
  return function (...args) {
    // 同步函数
    let result;
    try {
      result = func.call(this, ...args);
    } catch (e) {
      if (times > 0) {
        return wait(time).then(() => retry(func, times - 1, time)(...args));
      }

      // 重试次数用尽
      return Promise.reject(e);
    }

    // 异步函数
    if (result instanceof Promise) {
      if (times > 0) {
        return result.catch(() =>
          wait(time).then(() => retry(func, times - 1, time)(...args)));
      }

      // 重试次数用尽
      return result;
    }

    return Promise.resolve(result);
  };
}

/**
 * @static
 * @summary 为函数设置超时
 * @param {Promise} func 待设置超时的函数
 * @param {Number} time 以毫秒为单位的超时时间
 * @param {Error} [err] 超时时抛出的错误
 * @returns {Function} 带超时的函数
 */
function timeout(func, time, err = new Error('timeout')) {
  return function (...args) {
    return Promise.race([
      func.call(this, ...args),
      wait(time).then(() => Promise.reject(err)),
    ]);
  };
}

/**
 * @static
 * @summary 动态的 Promise.all
 * @param {Promise[]} array Promise 数组
 * @return {Promise} 当 array 中所有 Promise 状态都转化为 resolved 后 resolve
 */
async function dynamicAll(array) {
  let { length } = array;
  let result;
  while (true) {
    result = await Promise.all(array); // eslint-disable-line no-await-in-loop
    if (array.length === length) {
      break;
    }
    length = array.length;
  }
  return result;
}

/* eslint-disable no-console */
/**
 * @static
 * @summary 打印 Promise 内容后原样返回
 * @param {Any} data data
 * @return {Any} data
 */
function log(data) {
  console.log(data);
  return data;
}

/**
 * @static
 * @summary 打印 Promise 错误后原样抛出
 * @param {Any} err err
 * @return {undefined} undefined
 */
function error(err) {
  console.error(err);
  throw err;
}
/* eslint-enable no-console */

/**
 * @static
 * @summary 禁止函数并行执行
 * @param {Function} func 函数
 * @return {Any} 函数返回结果
 */
function noParallel(func) {
  let pending = false;
  return function (...param) {
    if (pending) return undefined;
    pending = true;
    const result = func.call(this, ...param);

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

module.exports = {
  wait,
  retry,
  timeout,
  log,
  error,
  dynamicAll,
  noParallel,
};
