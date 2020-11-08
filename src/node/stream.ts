import duplexer from 'duplexer3';
import { Duplex, Readable, Writable } from 'stream';

/**
 * 使用 pipe 拼接多个流对象
 * @param  {Stream[]} streams 待拼接的流
 * @return {stream.Duplex} 拼接后的双工流
 */
export function combine(...streams: (Readable | Writable)[]): Duplex {
  const [start] = streams;
  const end = streams.reduce(
    (prev, cur) => (prev ? (prev as Readable).pipe(cur as Writable) : cur),
    null,
  );
  return duplexer({ objectMode: true }, start, end);
}

export function readAll(readable: Readable): Promise<any> {
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
