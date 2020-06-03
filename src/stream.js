const duplexer = require('duplexer3');

/**
 * @static
 * @summary 使用 pipe 拼接多个流对象
 * @param  {Stream[]} streams 待拼接的流
 * @return {stream.Duplex} 拼接后的双工流
 */
function combine(...streams) {
  const [start] = streams;
  const end = streams.reduce((prev, cur) => (prev ? prev.pipe(cur) : cur));
  return duplexer({ objectMode: true }, start, end);
}

function readAll(readable) {
  return new Promise((resolve, reject) => {
    const result = [];

    readable.on('data', (data) => {
      result.push(data);
    });

    readable.on('end', () => {
      resolve(Buffer.concat(result));
    });

    readable.on('error', reject);

    if (!readable.readableFlowing) {
      readable.read();
    }
  });
}

module.exports = {
  combine,
  readAll,
};
