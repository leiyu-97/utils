/**
 * @module array
 */

/**
 * @static
 * @summary 分页
 * @param {Array} array 待排序数组
 * @param {Number} page 页码
 * @param {Number} size 分页数
 * @return {Array}
 */
const paging = (array, page = 0, size = 15) =>
  array.slice(page * size, (page + 1) * size);

/**
 * @static
 * @summary 排序
 * @param {Array} array 待排序数组
 * @param {"asc"|"desc"} order 顺序
 * @param {String} identity 排序字段
 * @return {Array}
 */
const sort = (array, order = 'asc', identity) => {
  const coefficient = order === 'desc' ? -1 : 1;
  array = [...array];

  return array.sort((a, b) => {
    if (identity) {
      a = a[identity];
      b = b[identity];
    }

    return (a > b ? 1 : -1) * coefficient;
  });
};

/**
 * @static
 * @summary 浅对比数组
 * @param {Array} a 对比数组
 * @param {Array} b 对比数组
 * @return {Array}
 */
const shallowEqual = (a, b) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

module.exports = {
  paging,
  sort,
  shallowEqual,
};
