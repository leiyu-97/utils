/**
 * @module function
 */
import CustomCache from '../cache/Cache';
import MapCache from '../cache/MapCache';
import { AnyFunc } from '../../typescript/utilityTypes';

interface memorizeOptions<T> {
  getKey?: (...args: any[]) => string;
  cache?: CustomCache<T>;
}
/**
 * 函数缓存
 * @param {Function} func 原函数
 * @param {Object} options 配置
 * @param {Class} options.getKey 获取缓存主键的函数
 * @param {Object} options.cache 缓存对象
 * @return {Any} 函数结果
 */
export function memorize<T extends AnyFunc>(
  func: T,
  options: memorizeOptions<ReturnType<T>> = {},
): (...args: Parameters<T>) => ReturnType<T> {
  const { getKey = JSON.stringify, cache = new MapCache<ReturnType<T>>() } = options;

  return function (...param: Parameters<T>): ReturnType<T> {
    const key: string = getKey(...param as any[]);
    let value: ReturnType<T> = cache.get(key);
    if (value === undefined) {
      value = func.apply(this, param);
      cache.set(key, value);
      if (value?.then?.call) {
        value.catch(() => cache.remove(key));
      }
    }
    return value;
  };
}

/**
 * 函数节流
 * @param {Function} func 原函数
 * @param {Number} time 节流时间
 * @return {Function} 添加了节流后的函数
 */
export function throttle<T extends AnyFunc>(
  func: (...args: Parameters<T>) => void,
  time: number,
): (...args: Parameters<T>) => void {
  let releaseTime = 0;
  return function (...params: Parameters<T>): void {
    if (Date.now() < releaseTime) return;
    releaseTime = Date.now() + time;
    func.apply(this, params);
  };
}

/**
 * 函数防抖
 * @param {Function} func 原函数
 * @param {Number} time 防抖时间
 * @return {Function} 添加了防抖后的函数
 */
export function debounce<T extends AnyFunc>(
  func: (...args: Parameters<T>) => void,
  time: number,
): (...args: Parameters<T>) => void {
  let t: ReturnType<typeof setTimeout>;
  return function (...params: Parameters<T>) {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      func.apply(this, params);
    }, time);
  };
}
