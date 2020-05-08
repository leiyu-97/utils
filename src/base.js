/**
 * @module base
 */

/**
 * @static
 * @summary 重复执行一个函数
 * @param {Function} func 目标函数
 * @param {Number} times 执行次数
 * @return {Array} 执行结果组成的数组
 */
function repeat(func, times) {
  const result = [];
  for (let index = 0; index < times; index++) {
    result.push(func());
  }
  return result;
}

module.exports = {
  repeat,
};
