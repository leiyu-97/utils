const assert = require('power-assert');
const { parse, stringify } = require('../../src/common/querystring');

describe('querystring', () => {
  describe('parse', () => {
    it('正常运行', () => {
      const obj = parse('foo=bar&key=value');
      assert(obj.foo === 'bar');
      assert(obj.key === 'value');
    });

    it('带特殊字符', () => {
      const obj = parse('foo=b%20r&key=value');
      assert(obj.foo === 'b r');
      assert(obj.key === 'value');
    });

    it('带空值', () => {
      const obj = parse('foo&key');
      assert(obj.foo === '');
      assert(obj.key === '');
    });
  });

  describe('stringify', () => {
    it('正常运行', () => {
      assert(stringify({ foo: 'bar', key: 'value' }) === 'foo=bar&key=value');
    });

    it('带特殊字符', () => {
      assert(stringify({ foo: 'b r', key: 'value' }) === 'foo=b%20r&key=value');
    });
  });
});
