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

module.exports = {
  memorize,
  throttle,
  debounce,
};