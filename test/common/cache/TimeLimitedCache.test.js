const assert = require('power-assert');
const TimeLimitedCache = require('../../../src/common/cache/TimeLimitedCache');
const { wait } = require('../../../src/common/promise');


describe('cache', () => {
  describe('TimeLimitedCache', () => {
    const cache = new TimeLimitedCache({ maxAge: 50 });
    it('写入正常', () => {
      cache.set('foo', 'bar');
      assert(cache.get('foo') === 'bar');
    });

    it('覆写正常', () => {
      cache.set('foo', 'baz');
      assert(cache.get('foo') === 'baz');
    });

    it('删除正常', () => {
      cache.remove('foo');
      assert(cache.get('foo') === undefined);
    });

    it('清空正常', () => {
      cache.set('foo', 'baz');
      cache.set('bar', 'baz');
      cache.clear();
      assert(cache.get('foo') === undefined);
      assert(cache.get('bar') === undefined);
    });

    it('缓存超时', function (done) {
      
      cache.set('foo', 'bar');
      wait(100).then(() => {
        assert(cache.get('foo') === undefined);
        done();
      });
    });

    it('自定义超时时间', function (done) {
      
      cache.set('foo', 'bar', 150);
      wait(100).then(() => {
        assert(cache.get('foo') === 'bar');
      });

      wait(200).then(() => {
        assert(cache.get('foo') === undefined);
        done();
      });
    });
  });
});
