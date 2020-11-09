/**
 * @module url
 */
import { objectToRegExp, exact } from './regexp';
import * as qs from './querystring';

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

/**
 * url 对象
 * @prop {String} protocal 协议
 * @prop {String} auth 凭证
 * @prop {String} username 用户名
 * @prop {String} password 密码
 * @prop {String} host 域
 * @prop {String} hostname 域名
 * @prop {String} port 端口
 * @prop {String} path 路径
 * @prop {String} pathname 路径名
 * @prop {String} query 查询字符串
 * @prop {String} queryObj 查询字符串对象
 * @prop {String} hash hash
 */
export default class Url {
  public queryObj: Record<string, string | undefined>;

  public protocol: string;

  public username: string;

  public password: string;

  public hostname: string;

  public port: string;

  public pathname: string;

  public hash: string;

  /**
   * @param {String} str 原始 url 字符串
   */
  constructor(str: string) {
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

  get query(): string | undefined {
    const { queryObj } = this;
    return queryObj ? qs.stringify(this.queryObj) : undefined;
  }

  set query(str: string) {
    this.queryObj = str ? qs.parse(str) : null;
  }

  get auth(): string | undefined {
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

  set auth(str: string) {
    const matchResult = str.match(authRegExp);
    if (!matchResult) {
      throw new Error(`"${str}" is not a valid auth`);
    }
    const [, username, password] = matchResult;
    this.username = username;
    this.password = password;
  }

  get host(): string {
    const { hostname, port } = this;
    return port ? `${hostname}:${port}` : hostname;
  }

  set host(str: string) {
    const matchResult = str.match(hostRegExp);
    if (!matchResult) {
      throw new Error(`"${str}" is not a valid host`);
    }
    const [, , hostname, port] = matchResult;
    this.hostname = hostname;
    this.port = port;
  }

  get path(): string {
    const { pathname, query } = this;
    let result = pathname;

    if (query) {
      result += `?${query}`;
    }

    return result;
  }

  set path(str: string) {
    const matchResult = str.match(pathRegExp);
    if (!matchResult) {
      throw new Error(`"${str}" is not a valid path`);
    }
    const [, , pathname, , query] = matchResult;
    this.pathname = pathname;
    this.query = query;
  }

  get origin(): string {
    const { host, protocol } = this;
    return protocol ? `${protocol}://${host}` : host;
  }

  set origin(str: string) {
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
   * @summary 返回完整的 url 字符串
   * @return {String} 完整的 url 字符串
   */
  toString(): string {
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