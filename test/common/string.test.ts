import assert from 'power-assert';
import sinon from 'sinon';
import { shallowEqual } from '../../src/common/array';
import { replaceWith } from '../../src/common/string';

describe('string', () => {
  describe('replaceWith', () => {
    it('pattern 为 string', () => {
      const result = replaceWith('123456789', '456', () => null);
      assert(shallowEqual(result, ['123', null, '789']));
    });

    it('pattern 为 string 多次匹配', () => {
      const result = replaceWith('123456784569', '456', () => null);
      assert(shallowEqual(result, ['123', null, '78', null, '9']));
    });

    it('pattern 为 RegExp', () => {
      const result = replaceWith('123456789', '456', () => null);
      assert(shallowEqual(result, ['123', null, '789']));
    });

    it('pattern 为 RegExp 多次匹配', () => {
      const result = replaceWith('123456784569', /456/g, () => null);
      assert(shallowEqual(result, ['123', null, '78', null, '9']));
    });

    it('replacer 参数正确', () => {
      const replacer = sinon.spy();
      replaceWith('abc123sgda23sdg953', /(\d+)/g, replacer);
      assert(shallowEqual(replacer.args[0], ['123', '123']));
      assert(shallowEqual(replacer.args[1], ['23', '23']));
      assert(shallowEqual(replacer.args[2], ['953', '953']));
    });
  });
});
