const assert = require('power-assert');
const { optionalGet, optionalSet, unentries } = require('../../src/common/object');

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

      obj = { a: {} };
      optionalSet(obj, ['a', 'b', 'c', 'foo'], 'bar');
      assert(obj.a.b.c.foo === 'bar');
    });
  });

  describe('unentries', () => {
    it('正常返回', () => {
      const array = [
        ['foo', 'bar'],
        ['key', 'value'],
      ];
      const obj = unentries(array);
      assert(obj.foo === 'bar');
      assert(obj.key === 'value');
    });
  });
});
