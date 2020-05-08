/**
 * @module querystring
 */

/**
 * 解析查询字符串
 * @param {String} query 待解析的查询字符串
 * @return {Object} 查询对象
 */
const parse = (query) =>
  query
    .split('&')
    .map((str) => str.split('='))
    .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
    .reduce((prev, [key, value = '']) => ({ ...prev, [key]: value }), {});

/**
 * 将对象转换为查询字符串
 * @param {Object} obj 查询对象
 * @return {String} 查询字符串
 */
const stringify = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => [encodeURIComponent(key), encodeURIComponent(value)])
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

module.exports = {
  parse,
  stringify,
};
