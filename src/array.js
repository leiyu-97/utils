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
const paging = (array, page, size = 15) => array.slice(page * size, page * (size + 1));


/**
 * @static
 * @summary 排序
 * @param {Array} array 待排序数组
 * @param {"asc"|"desc"} order 顺序
 * @param {String} identity 排序字段
 * @return {Array}
 */
const sort = (array, order = 'asc', identity) => {
  const coefficient = (order === 'desc' ? -1 : 1);

  return array.sort((a, b) => {
    if (identity) {
      a = a.identity;
      b = b.identity;
    }

    return (a > b ? 1 : -1) * coefficient;
  });
};

module.export = {
  paging,
  sort,
};
