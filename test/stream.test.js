const assert = require('assert');
const stream = require('stream');
const { repeat } = require('../src/string');
const { readAll } = require('../src/stream');

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

describe('stream', () => {
  describe('readAll', () => {
    it('正常工作', (done) => {
      const testReadable = new TestReadable(repeat('0', 100000));
      readAll(testReadable).then((data) => {
        assert(data instanceof Buffer);
        assert(data.toString().length === 100000);
        done();
      });
    });
  });
});
