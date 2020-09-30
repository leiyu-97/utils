/**
 * @module cache
 */
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
class TimeLimitedCache<T> extends MapCache<
  T | TimeLimitedCacheValue<T>
> {
  private _maxAge: number;

  /**
   * @param {Object} options 选项
   * @param {Number} options.maxAge 过期时间
   */
  constructor({ maxAge = Infinity }: TimeLimitedCacheOptions = {}) {
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
  public set(key: string, value: T, maxAge: number = this._maxAge): void {
    super.set(key, { value, expiresAt: Date.now() + maxAge });
  }

  /**
   * @summary 查询缓存
   * @param {Any} key 缓存主键
   * @return {Any} 缓存值
   */
  public get(key: string): T | undefined {
    const result = <TimeLimitedCacheValue<T>> super.get(key);
    if (!result) return undefined;
    const { value, expiresAt } = result;
    if (Date.now() > expiresAt) return undefined;
    return value;
  }
}

module.exports = TimeLimitedCache;
