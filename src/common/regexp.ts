/**
 * @module regexp
 */

const { raw } = String;

type RegObject =
  | { [key: string]: RegObject | string }
  | Array<RegObject | string>;

/**
 * 将对象的值拼接成字符串
 * @param {Object} obj 待拼接的对象
 * @return {String} 拼接后的字符串
 */
export function objectValuesToString(obj: RegObject): string {
  return Object.values(obj).reduce<string>((prev, cur) => {
    if (typeof cur === 'string') {
      return prev + cur;
    }
    return prev + objectValuesToString(cur);
  }, '');
}

/**
 * 将对象形式的正则表达式转换为正则表达式
 * @param {Object} obj 对象形式的正则表达式
 * @param {String} flags 正则表达式的 flags
 * @return {RegExp} 正则表达式
 */
export function objectToRegExp(obj: RegObject, flags?: string): RegExp {
  return new RegExp(objectValuesToString(obj), flags);
}

/**
 * 为对象形式的正则表达式添加首尾限制
 * @param {Object} obj 对象形式的正则表达式
 * @return {Object} obj 首尾限制的对象形式正则表达式
 */
export function exact(obj: RegObject): RegObject {
  return { b: raw`^`, obj, e: raw`$` };
}

/**
 * 为对象形式的正则表达式添加首部限制
 * @param {Object} obj 对象形式的正则表达式
 * @return {Object} obj 首部限制的对象形式正则表达式
 */
export function startsWith(obj: RegObject): RegObject {
  return { b: raw`^`, obj };
}

/**
 * 为对象形式的正则表达式添加尾部限制
 * @param {Object} obj 对象形式的正则表达式
 * @return {Object} obj 尾部限制的对象形式正则表达式
 */
export function endsWith(obj: RegObject): RegObject {
  return { obj, e: raw`$` };
}
