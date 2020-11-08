/**
 * @module traceId
 */
import { getHexIPAddress } from './os';

let index = 1000;
const ip = getHexIPAddress();
/**
 * 生成 traceId
 * @return {String} traceId
 */
export function traceId():string {
  const result = `${ip}${Date.now()}${index++}`;
  // 保持 index 在 1000 到 9000 之间
  if (index > 9000) {
    index = 1000;
  }
  return result;
}
