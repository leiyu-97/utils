/**
 * @module promise
 */

/**
 * @static
 * @summary 等待一段时间
 * @param  {Number} time 等待的毫秒数
 * @return {Function}
 */
const wait = (time) => () => new Promise((resolve) => setTimeout(resolve, time));

/**
 * @static
 * @summary 重试
 * @param  {Number} times 重试的次数
 * @param  {Number} time 重试的间隔毫秒数
 * @return {Function}
 */
const retry = (times = 1, time = 0) => (func) => (...args) => {
  const arr = [];
  for (let index = 0; index < times; index++) {
    arr.push(index + 1);
  }

  // 同步函数
  let result;
  try {
    result = func.call(this, ...args);
  } catch (e) {
    // 重试次数用尽
    if (times === 0) {
      throw e;
    }

    return wait(time)().then(() => retry(times - 1, time)(func)(...args));
  }

  // 异步函数
  if (result instanceof Promise) {
    return result.catch(() => wait(time)().then(() => retry(times - 1, time)(func)(...args)));
  }

  return result;
};

/**
 * @summary 为 Promise 设置超时
 * @param {Promise} func 设置超时的 Promise 对象
 * @param {Number} time 以毫秒为单位的超时时间
 * @param {Error} [error] 超时时抛出的错误
 * @returns {Function}
 */
const timeout = (time, error = new Error('timeout')) => (func) => (...args) => Promise.race([func(...args), wait(time)().then(() => Promise.reject(error))]);

module.exports = {
  wait,
  retry,
  timeout,
};
