/**
 * @module object
 */

/**
 * 获取嵌套对象某一属性值
 * @param {Object} obj 需要获取属性的对象
 * @param  {String[]} keys 键名数组
 * @return {Any} 属性值
 */
const optionalGet = (obj, [...keys]) => {
  const lastKey = keys.pop();

  return keys.reduce((prev, key) => prev[key] || {}, obj)[lastKey];
};

/**
 * 嵌套设置对象某一属性值，在访问过程中如果遇到属性不存在的情况时会创建一空对象
 * @param {Object} obj 设置的对象
 * @param  {String[]} keys 键名数组
 * @param {Any} value 设置的值
 * @return {Any} 属性值
 */
const optionalSet = (obj, [...keys], value) => {
  const lastKey = keys.pop();

  keys.reduce((prev, key) => {
    if (!prev[key]) {
      prev[key] = {};
    }
    return prev[key];
  }, obj)[lastKey] = value;

  return value;
};

module.exports = {
  optionalGet,
  optionalSet,
};
