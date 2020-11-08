/* eslint-disable max-classes-per-file */
const assert = require('assert');
const stream = require('stream');
const { readAll, combine } = require('../../src/node/stream');

class TestReadable extends stream.Readable {
  constructor(string) {
    super();
    this.data = Buffer.from(string, 'utf-8');
    this.size = this.data.length;
    this.i = 0;
  }

  _read(size) {
    if (this.i >= this.size) {
      this.push(null);
    } else {
      const start = this.i;
      this.i += size;
      const end = this.i;
      this.push(this.data.slice(start, end));
    }
  }
}

class TestWriteable extends stream.Writable {
  constructor() {
    super();
    this.data = Buffer.alloc(0);
  }

  _write(chunk, encoding, callback) {
    this.data = Buffer.concat([this.data, chunk]);
    callback();
  }
}

class TestTransform extends stream.Transform {
  constructor() {
    super();
    this.flow = 0;
  }

  _transform(chunk, encoding, callback) {
    this.push(chunk);
    this.flow += chunk.length;
    callback();
  }
}

describe('stream', () => {
  describe('readAll', () => {
    it('正常工作', (done) => {
      const testReadable = new TestReadable('0'.repeat(100000));
      readAll(testReadable).then((data) => {
        assert(data instanceof Buffer);
        assert(data.toString().length === 100000);
        done();
      });
    });
  });

  describe('combine', () => {
    it('拼接可读流和可写流正常工作', (done) => {
      const testReadable = new TestReadable('0'.repeat(100000));
      const testWriteable = new TestWriteable();
      combine(testReadable, testWriteable);

      testWriteable.on('finish', () => {
        assert(testWriteable.data.toString().length === 100000);
        done();
      });
    });

    it('拼接转换流正常工作', (done) => {
      const testReadable = new TestReadable('0'.repeat(100000));
      const testTransform = new TestTransform();
      const testWriteable = new TestWriteable();
      combine(testReadable, testTransform, testWriteable);

      testWriteable.on('finish', () => {
        assert(testWriteable.data.toString().length === 100000);
        assert(testTransform.flow === 100000);
        done();
      });
    });
  });
});
