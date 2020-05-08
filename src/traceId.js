/**
 * @module traceId
 */
const { getHexIPAddress } = require('./os');

let index = 1000;
const ip = getHexIPAddress();
/**
 * @static
 * @summary 生成 traceId
 * @return {String} traceId
 */
module.exports = function traceId() {
  const result = `${ip}${Date.now()}${index++}`;
  // 保持 index 在 1000 到 9000 之间
  if (index > 9000) {
    index = 1000;
  }
  return result;
};
