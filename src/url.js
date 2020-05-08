/**
 * @module http
 */
const { objectToRegExp } = require('./regexp');
const qs = require('./querystring');

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

/**
 * @static
 * @summary 解析 url
 * @param {String} url 待解析的 url
 * @return {Object} urlObj
 * @return {String} urlObj.href url
 * @return {String} urlObj.protocol 协议
 * @return {String} urlObj.auth 鉴权部分
 * @return {String} urlObj.username 用户名
 * @return {String} urlObj.password 密码
 * @return {String} urlObj.host 主机
 * @return {String} urlObj.hostname 域名
 * @return {String} urlObj.port 端口
 * @return {String} urlObj.path 路径（包括查询字符串）
 * @return {String} urlObj.pathname 路径（不包括查询字符串）
 * @return {String} urlObj.search 序列化查询部分
 * @return {String} urlObj.query 查询字符串
 * @return {String} urlObj.hash hash
 */
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

function stringify({
  protocol,
  username,
  password,
  hostname,
  port,
  pathname,
  query,
  hash,
}) {
  let url = '';

  if (protocol) {
    url += `${protocol}://`;
  }

  if (username) {
    url += username;
    if (password) {
      url += `:${password}`;
    }
    url += '@';
  }

  url += hostname;

  if (port) {
    url += `:${port}`;
  }

  if (pathname) {
    url += pathname;
  }

  if (query) {
    url += `?${query}`;
  }

  if (hash) {
    url += `#${hash}`;
  }

  return url;
}

/**
 * @static
 * @summary 为 url 中的查询字符串添加参数
 * @param {String} url 原始 url
 * @param {Object} param 添加的参数
 * @return {String} 添加参数后的查询字符串
 */
function addQuery(url, param) {
  const {
    protocol,
    username,
    password,
    hostname,
    port,
    pathname,
    query,
    hash,
  } = parse(url);
  const queryObj = qs.parse(query);
  Object.assign(queryObj, param);
  const newQuery = qs.stringify(queryObj);
  return stringify({
    protocol,
    username,
    password,
    hostname,
    port,
    pathname,
    hash,
    query: newQuery,
  });
}

module.exports = {
  parse,
  addQuery,
};
