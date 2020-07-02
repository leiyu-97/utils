/**
 * @module cache
 */
const MapCache = require('./MapCache');

/**
 * 有过期时间的缓存
 */
class TimeLimitedCache extends MapCache {
  /**
   * @param {Object} options 选项
   * @param {Number} options.maxAge 过期时间
   */
  constructor({ maxAge = Infinity } = {}) {
    super();
    this._maxAge = maxAge;
  }

  /**
   * @summary 设置缓存
   * @param {Any} key 缓存主键
   * @param {Any} value 缓存值
   * @param {Number} [maxAge] 过期时间，会覆盖默认的过期时间
   * @return {undefined}
   */
  set(key, value, maxAge = this._maxAge) {
    super.set(key, { value, expiresAt: Date.now() + maxAge });
  }

  /**
   * @summary 查询缓存
   * @param {Any} key 缓存主键
   * @return {Any} 缓存值
   */
  get(key) {
    const result = super.get(key);
    if (!result) return undefined;
    const { value, expiresAt } = result;
    if (Date.now() > expiresAt) return undefined;
    return value;
  }
}

module.exports = TimeLimitedCache;
