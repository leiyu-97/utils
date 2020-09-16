/**
 * @module http
 */
const { objectToRegExp, exact } = require('./regexp');
const qs = require('./querystring');

const { raw } = String;

const safeChar = 'a-zA-Z0-9-_.~';

const urlReg = {
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
};

const urlRegExp = objectToRegExp(exact(urlReg));
const authRegExp = objectToRegExp(
  exact([urlReg.oAuth.username, urlReg.oAuth.oPassword]),
);
const hostRegExp = objectToRegExp(exact(urlReg.wHost));
const pathRegExp = objectToRegExp(exact(urlReg.oPath));
const originRegExp = objectToRegExp(exact([urlReg.oProtocol, urlReg.wHost]));

class Url {
  /**
   * @param {String} str 原始 url 字符串
   */
  constructor(str) {
    const matchResult = str.match(urlRegExp);
    if (!matchResult) {
      throw new Error(`"${str}" is not a valid url`);
    }
    /* eslint-disable no-unused-vars */
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
    ] = matchResult;
    /* eslint-enable no-unused-vars */
    Object.assign(this, {
      protocol,
      username,
      password,
      hostname,
      port,
      pathname,
      query,
      hash,
    });
  }

  get query() {
    const { queryObj } = this;
    return queryObj ? qs.stringify(this.queryObj) : undefined;
  }

  set query(str) {
    this.queryObj = str ? qs.parse(str) : null;
  }

  get auth() {
    const { username, password } = this;
    let res = '';
    if (username) {
      res += username;
      if (password) {
        res += `:${password}`;
      }
    }
    return res || undefined;
  }

  set auth(str) {
    const matchResult = str.match(authRegExp);
    if (!matchResult) {
      throw new Error(`"${str}" is not a valid auth`);
    }
    const [, username, password] = matchResult;
    this.username = username;
    this.password = password;
  }

  get host() {
    const { hostname, port } = this;
    return port ? `${hostname}:${port}` : hostname;
  }

  set host(str) {
    const matchResult = str.match(hostRegExp);
    if (!matchResult) {
      throw new Error(`"${str}" is not a valid host`);
    }
    const [, , hostname, port] = matchResult;
    this.hostname = hostname;
    this.port = port;
  }

  get path() {
    const { pathname, query } = this;
    let result = pathname;

    if (query) {
      result += `?${query}`;
    }

    return result;
  }

  set path(str) {
    const matchResult = str.match(pathRegExp);
    if (!matchResult) {
      throw new Error(`"${str}" is not a valid path`);
    }
    const [, , pathname, , query] = matchResult;
    this.pathname = pathname;
    this.query = query;
  }

  get origin() {
    const { host, protocol } = this;
    return protocol ? `${protocol}://${host}` : host;
  }

  set origin(str) {
    const matchResult = str.match(originRegExp);
    if (!matchResult) {
      throw new Error(`"${str}" is not a valid origin`);
    }
    const [, protocol, , hostname, port] = matchResult;
    this.protocol = protocol;
    this.hostname = hostname;
    this.port = port;
  }

  /**
   * 返回完整的 url 字符串
   * @return {String} 完整的 url 字符串
   */
  toString() {
    let url = '';
    const {
      protocol, auth, host, path, hash,
    } = this;

    if (protocol) {
      url += `${protocol}://`;
    }

    if (auth) {
      url += `${auth}@`;
    }

    url += host;
    url += path;

    if (hash !== undefined) {
      url += `#${hash}`;
    }

    return url;
  }
}

module.exports = Url;
