const assert = require('power-assert');
import MapCache from '../../../src/common/cache/MapCache';

describe('cache', () => {
  describe('MapCache', () => {
    const cache = new MapCache();
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
  });
});
