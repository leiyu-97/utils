/**
 * 将 Buffer 分隔为子 Buffer 数组
 * @param {Buffer} buffer buffer
 * @param {String|Buffer} separator 分隔符
 * @return {Buffer[]} 子 Buffer 数组
 */
export function split(buffer: Buffer, separator: string | Buffer): Buffer[] {
  const result = [];
  let cur = 0;
  while (true) {
    const index = buffer.indexOf(separator, cur);
    if (index === -1) {
      result.push(buffer.slice(cur));
      break;
    }
    result.push(buffer.slice(cur, index));
    cur = index + separator.length;
  }
  return result;
}
