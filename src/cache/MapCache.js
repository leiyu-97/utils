/**
 * @module cache
 */

/**
 * 使用 Map 的缓存
 */
class MapCache {
  constructor() {
    this._cache = new Map();
  }

  /**
   * @summary 设置缓存
   * @param {Any} key 缓存主键
   * @param {Any} value 缓存值
   * @return {undefined}
   */
  set(key, value) {
    this._cache.set(key, value);
  }

  /**
   * @summary 查询缓存
   * @param {Any} key 缓存主键
   * @return {Any} 缓存值
   */
  get(key) {
    return this._cache.get(key);
  }

  /**
   * @summary 查询缓存
   * @param {Any} key 缓存主键
   * @return {undefined}
   */
  remove(key) {
    this._cache.delete(key);
  }

  /**
   * @summary 清空缓存
   * @return {undefined}
   */
  clear() {
    this._cache.clear();
  }
}

module.exports = MapCache;
