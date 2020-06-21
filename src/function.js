/**
 * @module function
 */
const MapCache = require('./cache/MapCache');

/**
 * @static
 * @summary 函数缓存
 * @param {Function} func 原函数
 * @param {Object} options 配置
 * @param {Class} options.getKey 获取缓存主键的函数
 * @param {Object|String} options.cache 缓存对象
 * @return {Any} 函数结果
 */
const memorize = (func, options = {}) => {
  const { getKey = JSON.stringify, cache = new MapCache() } = options;

  return function (...param) {
    const key = getKey(...param);
    let value = cache.get(key);
    if (value === undefined) {
      value = func.call(this, ...param);
      cache.set(key, value);
    }
    return value;
  };
};

/**
 * @static
 * @summary 函数节流
 * @param {Function} func 原函数
 * @param {Number} time 节流时间
 * @param {Any} context context
 * @return {Function} 添加了节流后的函数
 */
const throttle = (func, time, context = null) => {
  let releaseTime = 0;
  return (...params) => {
    if (Date.now() < releaseTime) return;
    releaseTime = Date.now() + time;
    func.call(context, ...params);
  };
};

/**
 * @static
 * @summary 函数防抖
 * @param {Function} func 原函数
 * @param {Number} time 防抖时间
 * @param {Any} context context
 * @return {Function} 添加了防抖后的函数
 */
const debounce = (func, time, context = null) => {
  let t;
  return (...params) => {
    if (t) clearTimeout(t);
    t = setTimeout(func.bind(context, ...params), time);
  };
};

const RECURSOR = Symbol('recursor');
/**
 * @static
 * @summary 将递归函数转化为迭代函数，使用方法参考
 * @param {Function} func 递归函数
 * @return {Function} 迭代函数
 */
const recurToIter = (func) => {
  const tasks = []; // 递归任务栈
  const iterators = []; // 正在等待返回的任务栈
  const results = []; // 结果栈

  // 传入函数中作为迭代函数的替代
  const recursor = (...task) => {
    tasks.push(task);
    return RECURSOR;
  };

  // 执行 iterator 的 next 方法并处理结果
  const next = (iterator, preResult) => {
    while (true) {
      const result = iterator.next(preResult);

      // 内部函数调用了 recursor，暂停执行并将 iterator 推入 iterators
      if (result.value === RECURSOR) {
        iterators.push(iterator);
        break;
      }

      // 内部函数返回了最终结果，将结果推入 results
      if (result.done) {
        results.push(result.value);
        break;
      }

      // 内部函数进行了一次没有意义的 yield，继续 next
      preResult = result.value;
    }
  };

  return (...params) => {
    // 初始化任务
    tasks.push(params);

    while (tasks.length) {
      // 处理 tasks 中的任务，直到处理完成
      while (tasks.length) {
        const task = tasks.pop();
        const iterator = func(recursor, ...task);
        next(iterator);
      }

      // 处理 iterators 中的任务
      // 直到 tasks 中出现新任务，优先执行 tasks
      // 直到 iterators 执行完毕，返回结果
      while (!tasks.length && iterators.length) {
        const iterator = iterators.pop();
        if (!iterator) break;
        const preResult = results.pop();
        next(iterator, preResult);
      }
    }

    return results.pop();
  };
};

module.exports = {
  memorize,
  throttle,
  debounce,
  recurToIter,
};
