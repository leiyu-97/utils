const assert = require('assert');
const Url = require('../src/url');

describe('path', () => {
  describe('Url', () => {
    it('解析失败', () => {
      assert.throws(() => new Url('https://www.google.com/ ?foo=bar'));
    });
    it('协议解析正确', () => {
      assert((new Url('127.0.0.1')).protocol === undefined);
      assert((new Url('http://127.0.0.1')).protocol === 'http');
      assert((new Url('https://www.google.com/')).protocol === 'https');
    });
    it('协议设置正确', () => {
      const url = new Url('https://www.google.com/');
      url.protocol = 'http';
      assert(url.toString() === 'http://www.google.com/');
    });
    it('凭证解析正确', () => {
      assert((new Url('http://127.0.0.1')).auth === undefined);
      assert((new Url('https://user@www.google.com/')).auth === 'user');
      assert((new Url('https://user:pass@www.google.com/')).auth === 'user:pass');
    });
    it('凭证设置正确', () => {
      const url = new Url('https://www.google.com/');
      url.auth = 'user:pass';
      assert.throws(() => { url.auth = 'user:pass:pass'; });
      assert(url.toString() === 'https://user:pass@www.google.com/');
    });
    it('用户名解析正确', () => {
      assert((new Url('http://127.0.0.1')).username === undefined);
      assert((new Url('https://user@www.google.com/')).username === 'user');
      assert((new Url('https://user:pass@www.google.com/')).username === 'user');
    });
    it('用户名设置正确', () => {
      const url = new Url('https://www.google.com/');
      url.username = 'user';
      assert(url.toString() === 'https://user@www.google.com/');
    });
    it('密码解析正确', () => {
      assert((new Url('http://127.0.0.1')).password === undefined);
      assert((new Url('https://user@www.google.com/')).password === undefined);
      assert((new Url('https://user:pass@www.google.com/')).password === 'pass');
    });
    it('密码设置正确', () => {
      const url = new Url('https://user@www.google.com/');
      url.password = 'pass';
      assert(url.toString() === 'https://user:pass@www.google.com/');
    });
    it('域解析正确', () => {
      assert((new Url('http://127.0.0.1')).host === '127.0.0.1');
      assert((new Url('https://user@www.google.com/')).host === 'www.google.com');
      assert((new Url('http://127.0.0.1:8080')).host === '127.0.0.1:8080');
    });
    it('域设置正确', () => {
      const url = new Url('https://user@www.google.com:8080/');
      url.host = 'localhost:80';
      assert.throws(() => { url.host = 'http://localhost'; });
      assert(url.toString() === 'https://user@localhost:80/');
    });
    it('域名解析正确', () => {
      assert((new Url('http://127.0.0.1')).hostname === '127.0.0.1');
      assert((new Url('https://user@www.google.com/')).hostname === 'www.google.com');
      assert((new Url('http://127.0.0.1:8080')).hostname === '127.0.0.1');
    });
    it('域名设置正确', () => {
      const url = new Url('https://user@www.google.com:8080/');
      url.hostname = 'localhost';
      assert(url.toString() === 'https://user@localhost:8080/');
    });
    it('端口解析正确', () => {
      assert((new Url('http://127.0.0.1')).port === undefined);
      assert((new Url('https://user@www.google.com/')).port === undefined);
      assert((new Url('http://127.0.0.1:8080')).port === '8080');
    });
    it('端口设置正确', () => {
      const url = new Url('https://user@www.google.com:8080/');
      url.port = '8081';
      assert(url.toString() === 'https://user@www.google.com:8081/');
    });
    it('路径解析正确', () => {
      assert((new Url('http://127.0.0.1')).path === undefined);
      assert((new Url('https://127.0.0.1/')).path === '/');
      assert((new Url('http://127.0.0.1:8080/path/index.html?query')).path === '/path/index.html?query');
    });
    it('路径设置正确', () => {
      const url = new Url('https://localhost/path?foo');
      url.path = '/p/a/t/h?foo=bar';
      assert.throws(() => { url.path = '/path#123'; });
      assert(url.toString() === 'https://localhost/p/a/t/h?foo=bar');
    });
    it('路径名解析正确', () => {
      assert((new Url('http://127.0.0.1')).pathname === undefined);
      assert((new Url('https://127.0.0.1/')).pathname === '/');
      assert((new Url('http://127.0.0.1:8080/path/index.html?query')).pathname === '/path/index.html');
    });
    it('路径名设置正确', () => {
      const url = new Url('https://localhost/path?foo');
      url.pathname = '/p/a/t/h';
      assert(url.toString() === 'https://localhost/p/a/t/h?foo');
    });
    it('查询字符串解析正确', () => {
      assert((new Url('http://127.0.0.1')).query === undefined);
      assert((new Url('http://127.0.0.1:8080/path/index.html?')).query === undefined);
      assert((new Url('http://127.0.0.1:8080/path/index.html?foo')).query === 'foo');
      assert((new Url('http://127.0.0.1:8080/path/index.html?foo=bar#hash')).query === 'foo=bar');
    });
    it('查询字符串设置正确', () => {
      const url = new Url('https://localhost/path?foo');
      url.queryObj.foo = 'bar';
      url.queryObj.baz = undefined;
      assert(url.toString() === 'https://localhost/path?foo=bar&baz');
    });
    it('hash解析正确', () => {
      assert((new Url('http://127.0.0.1:8080/path/index.html?query')).hash === undefined);
      assert((new Url('http://127.0.0.1:8080/path/index.html#')).hash === '');
      assert((new Url('http://127.0.0.1:8080/path/index.html?query#hash')).hash === 'hash');
    });
    it('hash设置正确', () => {
      const url = new Url('https://localhost/path?foo#123');
      url.hash = '456';
      assert(url.toString() === 'https://localhost/path?foo#456');
    });
    it('源解析正确', () => {
      assert((new Url('http://127.0.0.1/path/index.html?query')).origin === 'http://127.0.0.1');
      assert((new Url('http://127.0.0.1:8080/path/index.html#')).origin === 'http://127.0.0.1:8080');
      assert((new Url('http://user:pass@127.0.0.1:8080/path/index.html?query#hash')).origin === 'http://127.0.0.1:8080');
    });
    it('源设置正确', () => {
      const url = new Url('https://user:pass@localhost/path?foo#123');
      url.origin = 'http://www.google.com:8080';
      assert.throws(() => { url.origin = '/path#123'; });
      assert(url.toString() === 'http://user:pass@www.google.com:8080/path?foo#123');
    });
    it('综合解析测试', () => {
      const url = new Url('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
      assert(url.toString() === 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
      assert(url.protocol === 'https');
      assert(url.auth === 'user:pass');
      assert(url.username === 'user');
      assert(url.password === 'pass');
      assert(url.host === 'sub.example.com:8080');
      assert(url.hostname === 'sub.example.com');
      assert(url.port === '8080');
      assert(url.path === '/p/a/t/h?query=string');
      assert(url.pathname === '/p/a/t/h');
      assert(url.query === 'query=string');
      assert(url.hash === 'hash');
      assert(url.origin === 'https://sub.example.com:8080');
    });
  });
});
