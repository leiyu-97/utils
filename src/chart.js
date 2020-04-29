/**
 * @static
 * @summary 线性插值
 * @param {Array} param0
 * @param {Number} param0.0 x0，该点的 x 坐标
 * @param {Number} param0.1 y0，该点的 y 坐标
 * @param {Array} param1
 * @param {Number} param1.0 x1，该点的 x 坐标
 * @param {Number} param1.1 y1，该点的 y 坐标
 * @return {Function} 插值函数
 */
const linearInterpolation = ([x0, y0], [x1, y1]) => (x) =>
  y0 + (x - x0) * ((y1 - y0) / (x1 - x0));

/**
 * @static
 * @summary 三次 Hermite 插值
 * @param {Array} param0
 * @param {Number} param0.0 x0，该点的 x 坐标
 * @param {Number} param0.1 y0，该点的 y 坐标
 * @param {Number} param0.2 m0，该点的梯度
 * @param {Array} param1
 * @param {Number} param1.0 x1，该点的 x 坐标
 * @param {Number} param1.1 y1，该点的 y 坐标
 * @param {Number} param1.2 m1，该点的梯度
 * @return {Function} 插值函数
 */
const cubicHermiteInterpolation = ([x0, y0, m0], [x1, y1, m1]) => (x) =>
  y0 * (1 + 2 * ((x - x0) / (x1 - x0))) * ((x - x1) / (x0 - x1)) ** 2
  + y1 * (1 + 2 * ((x - x1) / (x0 - x1))) * ((x - x0) / (x1 - x0)) ** 2
  + m0 * (x - x0) * ((x - x1) / (x0 - x1)) ** 2
  + m1 * (x - x1) * ((x - x0) / (x1 - x0)) ** 2;

/**
 * @static
 * @summary 缓动函数
 * @param {Number} t 1 > t > 0
 * @return {Function} 插值函数
 */
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);

module.exports = {
  cubicHermiteInterpolation,
  linearInterpolation,
  fade,
};
