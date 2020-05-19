const assert = require('assert');
const { optionalGet, optionalSet } = require('../src/object');

describe('object', () => {
  describe('optionalGet', () => {
    const obj = { a: { b: { c: { foo: 'bar' } } } };

    it('正常返回', () => {
      assert(optionalGet(obj, ['a', 'b', 'c', 'foo']) === 'bar');
      assert(optionalGet(obj, ['a', 'b', 'c', 'd']) === undefined);
      assert(optionalGet(obj, ['a', 'd']) === undefined);
      assert(optionalGet(obj, ['d']) === undefined);
    });
  });

  describe('optionalSet', () => {
    it('正常返回', () => {
      let obj = {};
      optionalSet(obj, ['foo'], 'bar');
      assert(obj.foo === 'bar');

      obj = {};
      optionalSet(obj, ['a', 'b', 'c', 'foo'], 'bar');
      assert(obj.a.b.c.foo === 'bar');
    });
  });
});
