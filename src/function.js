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

module.exports = {
  memorize,
};
