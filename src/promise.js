/**
 * @module promise
 */

/**
 * @static
 * @summary 等待一段时间
 * @param  {Number} time 等待的毫秒数
 * @return {Promise} Promise
 */
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

/**
 * @static
 * @summary 为函数添加重试逻辑
 * @param {Function} func 待重试的函数
 * @param  {Number} times 重试的次数
 * @param  {Number} time 重试的间隔毫秒数
 * @return {Function} 带重试的函数
 */
const retry = (func, times = 1, time = 0) => (...args) => {
  // 同步函数
  let result;
  try {
    result = func(...args);
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

/**
 * @static
 * @summary 为函数设置超时
 * @param {Promise} func 待设置超时的函数
 * @param {Number} time 以毫秒为单位的超时时间
 * @param {Error} [error] 超时时抛出的错误
 * @returns {Function} 带超时的函数
 */
const timeout = (func, time, error = new Error('timeout')) => (...args) =>
  Promise.race([func(...args), wait(time).then(() => Promise.reject(error))]);

/**
 * @static
 * @summary 动态的 Promise.all
 * @param {Promise[]} array Promise 数组
 * @return {Promise} 当 array 中所有 Promise 状态都转化为 resolved 后 resolve
 */
const dynamicAll = async (array) => {
  let { length } = array;
  let result;
  while (true) { // eslint-disable-line no-constant-condition
    result = await Promise.all(array); // eslint-disable-line no-await-in-loop
    if (array.length === length) {
      break;
    }
    length = array.length;
  }
  return result;
};

/* eslint-disable no-console */
/**
 * @static
 * @summary 打印 Promise 内容后原样返回
 * @param {Any} data data
 * @return {Any} data
 */
const log = (data) => {
  console.log(data);
  return data;
};

/**
 * @static
 * @summary 打印 Promise 错误后原样抛出
 * @param {Any} err err
 * @return {undefined} undefined
 */
const error = (err) => {
  console.error(err);
  throw err;
};
/* eslint-enable no-console */

module.exports = {
  wait,
  retry,
  timeout,
  log,
  error,
  dynamicAll,
};
