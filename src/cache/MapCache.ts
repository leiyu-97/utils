/**
 * @module cache
 */
import CustomCache from './Cache';

/**
 * 使用 Map 的缓存
 */
class MapCache<T> extends CustomCache<T> {
  private cache = new Map<string, T>();

  /**
   * @summary 设置缓存
   * @param {Any} key 缓存主键
   * @param {Any} value 缓存值
   * @return {undefined}
   */
  public set(key: string, value: T): void {
    this.cache.set(key, value);
  }

  /**
   * @summary 查询缓存
   * @param {Any} key 缓存主键
   * @return {Any} 缓存值
   */
  public get(key: string): T | undefined {
    return this.cache.get(key);
  }

  /**
   * @summary 移除缓存
   * @param {Any} key 缓存主键
   * @return {undefined}
   */
  public remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * @summary 清空缓存
   * @return {undefined}
   */
  public clear(): void {
    this.cache.clear();
  }
}

export default MapCache;
