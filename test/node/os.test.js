const assert = require('power-assert');
const { getHexIPAddress, getIPAddress } = require('../../src/node/os');

describe('os', () => {
  describe('getIPAddress', () => {
    it('正常返回', () => {
      assert(getIPAddress());
    });
  });

  describe('getHexIPAddress', () => {
    it('正常返回', () => {
      assert(getHexIPAddress());
    });
  });
});
