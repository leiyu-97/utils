const assert = require('assert');
const { getHexIPAddress, getIPAddress } = require('../src/os');

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
