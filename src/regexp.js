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
 * 将对象形式的正则表达式转换为正则表达式
 * @param {Object} obj 对象形式的正则表达式
 * @return {RegExp}
 */
const objectToRegExp = (obj) => new RegExp(objectValuesToString(obj));

module.exports = {
  objectToRegExp,
};
