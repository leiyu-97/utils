/**
 * @module math
 */

/**
 * @static
 * @summary 高斯分布随机
 * @param {Number} mu μ
 * @param {Number} sigma σ
 */
function normalRandom(mu, sigma) {
  // https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
  const u1 = Math.random();
  const u2 = Math.random();

  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
  return z0 * sigma + mu;
}

module.exports = {
  normalRandom,
};
