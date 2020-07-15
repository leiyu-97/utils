/**
 * @module object
 */

/**
 * @static
 * @summary 获取嵌套对象某一属性值
 * @param {Object} obj 需要获取属性的对象
 * @param  {String[]} keys 键名数组
 * @return {Any} 属性值
 */
function optionalGet(obj, [...keys]) {
  let result = obj;
  for (let i = 0; i < keys.length && result !== undefined; i++) {
    const key = keys[i];
    result = result[key];
  }
  return result;
}

/**
 * @static
 * @summary 嵌套设置对象某一属性值，在访问过程中如果遇到属性不存在的情况时会创建一空对象
 * @param {Object} obj 设置的对象
 * @param  {String[]} keys 键名数组
 * @param {Any} value 设置的值
 * @return {Any} 属性值
 */
function optionalSet(obj, [...keys], value) {
  const lastKey = keys.pop();

  keys.reduce((prev, key) => {
    if (!prev[key]) {
      prev[key] = {};
    }
    return prev[key];
  }, obj)[lastKey] = value;

  return value;
}

/**
 * @static
 * @summary 浅对比两个对象
 * @param {Object} objA 对象A
 * @param {Object} objB 对象B
 * @return {Boolean} 两对象是否浅层相等
 */
function shallowEqual(objA, objB) {
  return (
    Object.values(objA).length === Object.values(objB).length
    && Object.entries(objA).every(([key, value]) => objB[key] === value)
  );
}

/**
 * @static
 * @summary 将键值对数组转为对象时，传入 reduce 方法中的 reducer
 * @param {Object|undefined} prev 前一次累计对象
 * @param {Array} param1 当前键值对
 * @param {String} param1.0 键
 * @param {Any} param1.1 值
 * @return {Object} 累计对象
 */
function unentriesReducer(prev, [key, value]) {
  // 为了 reduce 可以不传入第二个参数而做的兼容
  if (prev instanceof Array) prev = unentriesReducer({}, prev);
  prev[key] = value;
  return prev;
}

/**
 * @static
 * @summary 将键值对数组转为对象，Object.entries 的反操作
 * @param {Array} array 键值对数组
 * @return {Object} 对象
 */
function unentries(array) {
  return array.reduce(unentriesReducer);
}

module.exports = {
  optionalGet,
  optionalSet,
  shallowEqual,
  unentriesReducer,
  unentries,
};
