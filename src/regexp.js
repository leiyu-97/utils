/**
 * @module regexp
 */

const { raw } = String;

/**
 * @static
 * @summary 将对象的值拼接成字符串
 * @param {Object} obj 待拼接的对象
 * @return {String} 拼接后的字符串
 */
function objectValuesToString(obj) {
  return Object.values(obj).reduce((prev, cur) => {
    if (typeof cur === 'string') {
      return prev + cur;
    }
    return prev + objectValuesToString(cur);
  }, '');
}

/**
 * @static
 * @summary 将对象形式的正则表达式转换为正则表达式
 * @param {Object} obj 对象形式的正则表达式
 * @param {String} flags 正则表达式的 flags
 * @return {RegExp} 正则表达式
 */
function objectToRegExp(obj, flags) {
  return new RegExp(objectValuesToString(obj), flags);
}

/**
 * @static
 * @summary 为对象形式的正则表达式添加首尾限制
 * @param {Object} obj 对象形式的正则表达式
 * @return {Object} obj 首尾限制的对象形式正则表达式
 */
function exact(obj) {
  return ({ b: raw`^`, obj, e: raw`$` });
}

/**
 * @static
 * @summary 为对象形式的正则表达式添加首部限制
 * @param {Object} obj 对象形式的正则表达式
 * @return {Object} obj 首部限制的对象形式正则表达式
 */
function startsWith(obj) {
  return ({ b: raw`^`, obj });
}

/**
 * @static
 * @summary 为对象形式的正则表达式添加尾部限制
 * @param {Object} obj 对象形式的正则表达式
 * @return {Object} obj 尾部限制的对象形式正则表达式
 */
function endsWith(obj) {
  return ({ obj, e: raw`$` });
}

module.exports = {
  objectToRegExp,
  objectValuesToString,
  exact,
  startsWith,
  endsWith,
};
