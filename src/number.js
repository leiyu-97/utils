/**
 * @module number
 */
const { objectToRegExp } = require('./regexp');
const { repeat } = require('./string');

/**
 * @summary 对比两个浮点数是否相等
 *
 * 参考 [https://zh.wikipedia.org/wiki/%E8%AF%AF%E5%B7%AE%E4%BC%A0%E6%92%AD](误差传递公式)
 * @param {Number} a 待对比数字
 * @param {Number} b 待对比数字
 * @param {Number} uncertainty 误差系数
 */
const isEqual = (a, b, uncertainty = 10) => Math.abs(a - b) < Number.EPSILON * uncertainty;

const { raw } = String;
const floatExp = {
  b: raw`^`,
  negative: raw`([+-])?`,
  or: {
    b: raw`(?:`,
    oNum: { // 正常数字
      integer: raw`(\d+)`, // 整数部分
      oFraction: {
        b: raw`(?:`,
        point: raw`.`, // 小数点
        fraction: raw`(\d+)`, // 小数部分
        e: raw`)?`,
      },
    },
    or: raw`|`,
    oScientific: { // 科学计数法
      wMantissa: { // 有效数
        b: raw`(`,
        integer: raw`\d+`, // 整数部分
        fraction: {
          b: raw`(?:`,
          point: raw`.`, // 小数点
          fraction: raw`\d+`, // 小数部分
          e: raw`)?`,
        },
        e: raw`)`,
      },
      e: raw`e`,
      wOrder: { // 级数
        b: raw`(`,
        negative: raw`[-+]?`,
        num: raw`\d+`,
        e: raw`)`,
      },
    },
    e: raw`)`,
  },
  e: raw`$`,
};
const floatRegExp = objectToRegExp(floatExp);

/**
 * @summary 将数字精确到某一位，-1 为精确到一位小数，0 为精确到整数位，1 为精确到十位
 * @param {Number} num 数字
 * @param {Number} accuracy
 * @return {Number}
 */
const accurate = (num, accuracy = 0) => {
  const power = 10 ** accuracy;
  const result = Math.round(num / power) * power;
  if (accuracy >= 0) {
    return result;
  }
  // 浮点数运算可能会存在误差，因此需要操作字符串
  const numStr = `${result}`;
  const [, negative = '', integer = '0', fraction = '0', mantissa, order] = numStr.match(floatRegExp);
  if (mantissa) {
    // 科学计数法
    if (order < accuracy) {
      return result;
    }
    return parseFloat(`${negative}${(mantissa / power) * power}e${order}`);
  }
  return parseFloat(`${negative}${integer}.${fraction.slice(0, -accuracy)}`);
};

/**
 * @summary 将数字转换为不使用科学计数法的字符串
 * @param {Number} num 待转换数字
 * @return {String}
 */
const unscientific = (num) => {
  const numStr = `${num}`;
  const [, , , , mantissaStr, orderStr] = numStr.match(floatRegExp);
  if (!mantissaStr) {
    return numStr;
  }
  const order = parseInt(orderStr);
  if (order === 0) {
    return mantissaStr;
  }

  const [, negative = '', integer = '0', fraction = '0'] = mantissaStr.match(floatRegExp);
  if (order > 0) {
    // 1.23456789e5
    if (fraction.length < order) {
      return `${negative}${integer}${fraction}${repeat('0', order - fraction.length)}`;
    }
    // 1.234e10
    return `${negative}${integer}${fraction.slice(0, order)}.${fraction.slice(order)}`;
  }
  return `${negative}0.${repeat('0', -order)}${integer}${fraction}}`;
};

/**
 * @summary 将数字精确到某一位并自动补零，结果不会使用科学计数法
 * @param {Number} num
 * @param {Number} accuracy
 * @return {String}
 */
const accurateStringify = (num, accuracy = 0) => {
  const accuratedNum = accurate(num, accuracy);
  const result = unscientific(accuratedNum);
  if (accuracy >= 0) {
    return result;
  }
  const [, negative = '', integer = '0', fraction = '0'] = result.match(floatRegExp);
  return `${negative}${integer}.${fraction.padEnd(-accuracy, '0')}`;
};

module.exports = {
  isEqual,
  accurate,
  unscientific,
  accurateStringify,
};
