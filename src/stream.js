const duplexer = require('duplexer3');

/**
 * 使用 pipe 拼接多个流对象
 * @param  {...Stream} streams
 * @return {stream.Duplex}
 */
function combine(...streams) {
  const [start] = streams;
  const end = streams.reduce((prev, cur) => (prev ? prev.pipe(cur) : cur));
  return duplexer({ objectMode: true }, start, end);
}

module.exports = {
  combine,
};
