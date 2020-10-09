/**
 * @module function
 */
import CustomCache from '../cache/Cache';
import MapCache from '../cache/MapCache';

interface memorizeOptions<T> {
  getKey?: (...args: any[]) => string;
  cache?: CustomCache<T>;
}
/**
 * @static
 * @summary 函数缓存
 * @param {Function} func 原函数
 * @param {Object} options 配置
 * @param {Class} options.getKey 获取缓存主键的函数
 * @param {Object} options.cache 缓存对象
 * @return {Any} 函数结果
 */
export function memorize<Param extends any[], T>(
  func: (...args: Param) => T,
  options: memorizeOptions<T> = {},
): (...args: Param) => T {
  const { getKey = JSON.stringify, cache = new MapCache<T>() } = options;

  return function (...param) {
    const key: string = getKey(...param);
    let value: T = cache.get(key);
    if (value === undefined) {
      value = func.call(this, ...param);
      cache.set(key, value);
    }
    return value;
  };
}

export const a = 1;

/**
 * @static
 * @summary 函数节流
 * @param {Function} func 原函数
 * @param {Number} time 节流时间
 * @return {Function} 添加了节流后的函数
 */
export function throttle<Param extends any[]>(
  func: (...args: Param) => void,
  time: number,
): (...args: Param) => void {
  let releaseTime = 0;
  return function (...params: Param): void {
    if (Date.now() < releaseTime) return;
    releaseTime = Date.now() + time;
    func.call(this, ...params);
  };
}

/**
 * @static
 * @summary 函数防抖
 * @param {Function} func 原函数
 * @param {Number} time 防抖时间
 * @return {Function} 添加了防抖后的函数
 */
export function debounce<Param extends any[]>(
  func: (...args: Param) => void,
  time: number,
): (...args: Param) => void {
  let t;
  return function (...params: Param) {
    if (t) clearTimeout(t);
    t = setTimeout(func.bind(this, ...params), time);
  };
}
