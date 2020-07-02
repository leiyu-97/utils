/**
 * @module array
 */

/**
 * @static
 * @summary 分页
 * @param {Array} array 待排序数组
 * @param {Number} page 页码
 * @param {Number} size 分页数
 * @return {Array} 结果数组
 */
function paging(array, page = 0, size = 15) {
  return array.slice(page * size, (page + 1) * size);
}

/**
 * @static
 * @summary 排序
 * @param {Array} array 待排序数组
 * @param {"asc"|"desc"} order 顺序
 * @param {String} identity 排序字段
 * @return {Array} 结果数组
 */
function sort(array, order = 'asc', identity) {
  const coefficient = order === 'desc' ? -1 : 1;
  array = [...array];

  return array.sort((a, b) => {
    if (identity) {
      a = a[identity];
      b = b[identity];
    }

    return (a > b ? 1 : -1) * coefficient;
  });
}

/**
 * @static
 * @summary 浅对比数组
 * @param {Array} a 对比数组
 * @param {Array} b 对比数组
 * @return {Array} 结果数组
 */
function shallowEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

/**
 * @static
 * @summary 对数组元素进行分类
 * @param {Any[]} array 待分类数组
 * @param {String[]|function[]} keys 分类字段或方法，如果参数类型不为数组会转为单元素数组
 * @return {Object[]} result 分类后的数组
 * @return {Any[]} result.keys 分类后的数组
 * @return {Any[]} result.items 分类后的数组
 */
function classify(array, keys) {
  // 如果参数类型不为数组转为单元素数组
  if (!(keys instanceof Array)) {
    keys = [keys];
  }

  // 创建获取分类值的方法
  const [key, ...restKeys] = keys;
  let getValue;
  if (key instanceof Function) {
    getValue = key;
  } else {
    getValue = (item) => item[key];
  }

  // 分类
  const map = new Map();

  array.forEach((item) => {
    const value = getValue(item);
    if (!map.has(value)) {
      map.set(value, []);
    }

    map.get(value).push(item);
  });

  // 将结果转换为数组
  let result = [...map.entries()].map(([value, items]) => ({
    keys: [value],
    items,
  }));

  // 递归分类
  if (restKeys[0]) {
    const nestedResult = result.map((data) =>
      classify(data.items, restKeys).map((child) => ({
        // 将子分类的 keys 和父分类的 keys 合并
        keys: [...data.keys, ...child.keys],
        items: child.items,
      })));
    result = [].concat(...nestedResult);
  }

  return result;
}

/**
 * @static
 * @summary 多维数组转一维数组
 * @param {Array} array 多维数组
 * @return {Array} 一维数组
 */
function deepFlatten(array) {
  return [].concat(...array.map((v) => (Array.isArray(v) ? deepFlatten(v) : v)));
}

/**
 * @static
 * @summary 数组取交集
 * @param {Array} array 第一个数组
 * @param {Array} other 第二个数组
 * @return {Array} 交集数组
 */
function unite(array, other) {
  return array.filter((v) => other.includes(v));
}

module.exports = {
  paging,
  sort,
  shallowEqual,
  classify,
  deepFlatten,
  unite,
};
