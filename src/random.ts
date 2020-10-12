/**
 * @module random
 */

/**
 * @typedef {Array} Range
 * @prop {Number} min 最小值，可以等于
 * @prop {Number} max 最大值，不可等于
 */

import { repeat } from './base';

type Range = [number, number]

const number: Range = [0x0030, 0x0039 + 1]; // 数字
const uppercase: Range = [0x0041, 0x005a + 1]; // 英文大写字母
const lowercase: Range = [0x0061, 0x007a + 1]; // 英文小写字母

/**
 * @static
 * @summary 从一组不连续的范围中生成随机数
 * @param  {Range} range 范围数组
 * @return {Number} 随机数
 */
export function discontinuousRandom(...ranges: Array<Range>): number {
  const lengths = ranges.map((range) => range[1] - range[0]);
  // 将 lengths 累加成数组
  const reduceLengths = lengths.reduce(
    (prev, cur) => [...prev, prev[prev.length - 1] + cur],
    [0],
  );
  // 长度总和
  const sumLength = reduceLengths[reduceLengths.length - 1];
  // 随机数
  const randomNum = Math.random() * sumLength;
  // 取得随机数落到的区间
  const rangeIndex = reduceLengths.findIndex((reduceLength) => randomNum < reduceLength) - 1;
  return ranges[rangeIndex][0] + randomNum - reduceLengths[rangeIndex];
}

/**
 * @static
 * @summary 生成随机字符
 * @param {Range} range 范围数组
 * @return {String} 随机字符
 */
export function randomChar(...ranges: Array<Range>): string {
  if (!ranges[0]) ranges = [number, uppercase, lowercase];
  const randomRange = ranges.map(([min, max]) => [min, max] as Range);
  return String.fromCharCode(Math.floor(discontinuousRandom(...randomRange)));
}

/**
 * @static
 * @summary 生成随机字符串
 * @param {Number} length 字符串长度
 * @param {Range} range 范围数组
 * @return {String} 随机字符串
 */
export function randomStr(length: number, ...ranges: Array<Range>): string {
  if (!ranges[0]) ranges = [number, uppercase, lowercase];
  return repeat(() => randomChar(...ranges), length).join('');
}

/**
 * @static
 * @summary 生成任意位数的随机数
 * @param {Number} length 位数
 * @return {String} 随机数
 */
export function randomDigit(length: number): string {
  return randomStr(length, number);
}
