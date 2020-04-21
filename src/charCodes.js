/**
 * @module charCodes
 */

/**
 * @typedef {Array} Range
 * @prop {Number} min 最小值，可以等于
 * @prop {Number} max 最大值，不可等于
 */

/**
 * @summary 数字
 * @type Range
 */
exports.NUMBER = [48, 58];
/**
 * @summary 大写字母
 * @type Range
 */
exports.UPPERCASE = [65, 91];
/**
 * @summary 小写字母
 * @type Range
 */
exports.LOWERCASE = [97, 123];
