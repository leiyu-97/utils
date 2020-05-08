/**
 * @module http
 */
const { objectToRegExp } = require('./regexp');

const { raw } = String;

const safeChar = 'a-zA-Z0-9-_.~';

const urlReg = {
  b: raw`^`,
  oProtocol: {
    b: raw`(?:`,
    scheme: `([${safeChar}]+)`, // $1 协议，例: 'http'
    e: raw`://)?`,
  },
  oAuth: {
    // $2 用户信息，例: 'username:password'
    b: raw`(?:(`,
    username: `([${safeChar}]+)`, // $3 用户名，例: 'username'
    oPassword: {
      b: raw`(?::`,
      password: `([${safeChar}]+)`, // $4 密码，例: 'password'
      e: raw`)?`,
    },
    e: raw`)@)?`,
  },
  wHost: {
    b: raw`(`, // $5 域，例: 'example.com:123'
    hostname: `([${safeChar}]+)`, // $6 域名，例: 'example.com'
    oPort: {
      b: raw`(?::`,
      port: raw`(\d+)`, // $7 端口，例: '123'
      e: raw`)?`,
    },
    e: raw`)`,
  },
  oPath: {
    b: raw`(`, // $8 路径，例: '/path/data?foo=bar'
    oPathname: `([${safeChar}/]+)`, // $9 路径名，例: '/path/data'
    oSearch: {
      b: raw`(\?`, // $10 查询字符串，例: '?key=value&key2=value2'
      query: `([${safeChar}&=]+)?`, // $11 查询字符串，例: 'key=value&key2=value2'
      e: raw`)?`,
    },
    e: raw`)?`,
  },
  oHash: {
    b: raw`(?:#`,
    hash: raw`(.*)`, // $12 片段 id，例: 'fragid1'
    e: raw`)?`,
  },
  e: raw`$`,
};

const urlRegExp = objectToRegExp(urlReg);

function parse(url) {
  const [
    href,
    protocol,
    auth,
    username,
    password,
    host,
    hostname,
    port,
    path,
    pathname,
    search,
    query,
    hash,
  ] = url.match(urlRegExp);
  return {
    href,
    protocol,
    auth,
    username,
    password,
    host,
    hostname,
    port,
    path,
    pathname,
    search,
    query,
    hash,
    origin: protocol ? `${protocol}://${host}` : host,
  };
}

module.exports = {
  parse,
};
