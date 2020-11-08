/**
 * @module cache
 */
import CustomCache from './Cache';
import MapCache from './MapCache';

interface TimeLimitedCacheOptions {
  maxAge?: number;
}
interface TimeLimitedCacheValue<T> {
  value: T;
  expiresAt: number;
}
/**
 * 有过期时间的缓存
 */
class TimeLimitedCache<T> extends CustomCache<T> {
  private maxAge: number;

  private cache = new MapCache<TimeLimitedCacheValue<T>>()

  /**
   * @param {Object} options 选项
   * @param {Number} options.maxAge 过期时间
   */
  constructor({ maxAge = Infinity }: TimeLimitedCacheOptions = {}) {
    super();
    this.maxAge = maxAge;
  }

  /**
   * @summary 设置缓存
   * @param {Any} key 缓存主键
   * @param {Any} value 缓存值
   * @param {Number} [maxAge] 过期时间，会覆盖默认的过期时间
   * @return {undefined}
   */
  public set(key: string, value: T, maxAge: number = this.maxAge): void {
    this.cache.set(key, { value, expiresAt: Date.now() + maxAge });
  }

  /**
   * @summary 查询缓存
   * @param {Any} key 缓存主键
   * @return {Any} 缓存值
   */
  public get(key: string): T | undefined {
    const result = this.cache.get(key) as TimeLimitedCacheValue<T>;
    if (!result) return undefined;
    const { value, expiresAt } = result;
    if (Date.now() > expiresAt) return undefined;
    return value;
  }

  /**
   * @summary 移除缓存
   * @param {Any} key 缓存主键
   * @return {undefined}
   */
  public remove(key: string): void {
    this.cache.remove(key);
  }

  /**
   * @summary 清空缓存
   * @return {undefined}
   */
  public clear(): void {
    this.cache.clear();
  }
}

module.exports = TimeLimitedCache;
