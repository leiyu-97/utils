/**
 * @module regexp
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
const objectToRegExp = (obj, flags) => new RegExp(objectValuesToString(obj), flags);

module.exports = {
  objectToRegExp,
};
