const base = require('./base');

/**
 * 将一个字符串重复数次
 * @param {String} str 重复的字符串
 * @param {Number} times 重复次数
 * @return {String} 结果
 */
const repeat = (str, times) => {
  let result = '';
  base.repeat(() => { result += str; }, times);
  return result;
};

module.exports = {
  repeat,
};
