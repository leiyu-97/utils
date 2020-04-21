/**
 * @module random
 */

/**
 * @typedef {Array} Range
 * @prop {Number} min 最小值，可以等于
 * @prop {Number} max 最大值，不可等于
 */

const { NUMBER, LOWERCASE, UPPERCASE } = require('./charCodes');

/**
 * @static
 * @summary 从一组不连续的范围中生成随机数
 * @param  {Range} range 范围数组
 * @return {Number} 随机数
 */
function random(...ranges) {
  const lengths = ranges.map((range) => range[1] - range[0]);
  // 将 lengths 累加成数组
  const reduceLengths = lengths.reduce((prev, cur) => [...prev, prev[prev.length - 1] + cur], [0]);
  // 长度总和
  const sumLength = reduceLengths[reduceLengths.length - 1];
  // 随机数
  const randomNum = Math.floor(Math.random() * sumLength);
  // 取得随机数落到的区间
  const rangeIndex = reduceLengths.findIndex((reduceLength) => randomNum < reduceLength) - 1;
  return ranges[rangeIndex][0] + randomNum - reduceLengths[rangeIndex];
}

/**
 * @static
 * @summary 生成随机字符
 * @param {Range} range 范围数组
 * @return {String} 随机字符
 */
function randomChar(...ranges) {
  if (!ranges[0]) ranges = [NUMBER, UPPERCASE, LOWERCASE];
  return String.fromCharCode(random(...ranges));
}

/**
 * @static
 * @summary 生成随机字符串
 * @param {Number} length 字符串长度
 * @param {Range} range 范围数组
 * @return {String} 随机字符串
 */
function randomStr(length, ...ranges) {
  if (!ranges[0]) ranges = [NUMBER, UPPERCASE, LOWERCASE];
  let result = '';
  for (let cur = 0; cur < length; cur++) {
    result += randomChar(...ranges);
  }
  return result;
}

module.exports = {
  random,
  randomChar,
  randomStr,
};
