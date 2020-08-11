const assert = require('assert');
const { parse, addQuery } = require('../src/url');
const qs = require('../src/querystring');

describe('path', () => {
  describe('parse', () => {
    it('匹配失败时返回 null', () => {
      assert(parse('https://www.google.com/ ?foo=bar') === null);
    });
    it('协议正确', () => {
      assert(parse('127.0.0.1').protocol === undefined);
      assert(parse('http://127.0.0.1').protocol === 'http');
      assert(parse('https://www.google.com/').protocol === 'https');
    });
    it('凭证正确', () => {
      assert(parse('http://127.0.0.1').auth === undefined);
      assert(parse('https://user@www.google.com/').auth === 'user');
      assert(parse('https://user:pass@www.google.com/').auth === 'user:pass');
    });
    it('用户名正确', () => {
      assert(parse('http://127.0.0.1').username === undefined);
      assert(parse('https://user@www.google.com/').username === 'user');
      assert(parse('https://user:pass@www.google.com/').username === 'user');
    });
    it('密码正确', () => {
      assert(parse('http://127.0.0.1').password === undefined);
      assert(parse('https://user@www.google.com/').password === undefined);
      assert(parse('https://user:pass@www.google.com/').password === 'pass');
    });
    it('域正确', () => {
      assert(parse('http://127.0.0.1').host === '127.0.0.1');
      assert(parse('https://user@www.google.com/').host === 'www.google.com');
      assert(parse('http://127.0.0.1:8080').host === '127.0.0.1:8080');
    });
    it('域名正确', () => {
      assert(parse('http://127.0.0.1').hostname === '127.0.0.1');
      assert(parse('https://user@www.google.com/').hostname === 'www.google.com');
      assert(parse('http://127.0.0.1:8080').hostname === '127.0.0.1');
    });
    it('端口正确', () => {
      assert(parse('http://127.0.0.1').port === undefined);
      assert(parse('https://user@www.google.com/').port === undefined);
      assert(parse('http://127.0.0.1:8080').port === '8080');
    });
    it('路径正确', () => {
      assert(parse('http://127.0.0.1').path === undefined);
      assert(parse('https://127.0.0.1/').path === '/');
      assert(parse('http://127.0.0.1:8080/path/index.html?query').path === '/path/index.html?query');
    });
    it('路径名正确', () => {
      assert(parse('http://127.0.0.1').pathname === undefined);
      assert(parse('https://127.0.0.1/').pathname === '/');
      assert(parse('http://127.0.0.1:8080/path/index.html?query').pathname === '/path/index.html');
    });
    it('查询字符串正确', () => {
      assert(parse('http://127.0.0.1').search === undefined);
      assert(parse('http://127.0.0.1:8080/path/index.html?foo=bar').search === '?foo=bar');
      assert(parse('http://127.0.0.1:8080/path/index.html?foo#hash').search === '?foo');
      assert(parse('http://127.0.0.1').query === undefined);
      assert(parse('http://127.0.0.1:8080/path/index.html?').query === undefined);
      assert(parse('http://127.0.0.1:8080/path/index.html?foo').query === 'foo');
      assert(parse('http://127.0.0.1:8080/path/index.html?foo=bar#hash').query === 'foo=bar');
    });
    it('片段id正确', () => {
      assert(parse('http://127.0.0.1:8080/path/index.html?query').hash === undefined);
      assert(parse('http://127.0.0.1:8080/path/index.html#').hash === '');
      assert(parse('http://127.0.0.1:8080/path/index.html?query#hash').hash === 'hash');
    });
    it('综合测试', () => {
      const url = parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
      assert(url.href === 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
      assert(url.protocol === 'https');
      assert(url.auth === 'user:pass');
      assert(url.username === 'user');
      assert(url.password === 'pass');
      assert(url.host === 'sub.example.com:8080');
      assert(url.hostname === 'sub.example.com');
      assert(url.port === '8080');
      assert(url.path === '/p/a/t/h?query=string');
      assert(url.pathname === '/p/a/t/h');
      assert(url.search === '?query=string');
      assert(url.query === 'query=string');
      assert(url.hash === 'hash');
      assert(url.origin === 'https://sub.example.com:8080');
    });
  });

  describe('addQuery', () => {
    const originUrl = 'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash';
    const url = addQuery(originUrl, { query: 'string2', foo: 'bar' });
    const urlObj = parse(url);
    const queryObj = qs.parse(urlObj.query);
    it('正常返回', () => {
      assert(url);
    });

    it('添加参数', () => {
      assert(queryObj.foo === 'bar');
    });

    it('替换参数成功', () => {
      assert(queryObj.query === 'string2');
    });
  });
});
