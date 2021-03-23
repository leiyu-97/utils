/**
 * @module url
 */
import {
  objectToRegExp, exact, optional, group, oneOf,
} from './regexp';
import * as qs from './querystring';

const { raw } = String;

/** 非保留字符 */
const unreversed = raw`\w\-.~`;
const pctEncoded = '%';
/** url 组件内分隔字符 */
const subDelims = '!$&\'()*+,;=';
/** url 组件内安全字符 */
const safeChar = `${unreversed}${pctEncoded}${subDelims}`;
const safeChars = `[${safeChar}]+`;
const pChar = `${safeChar}:@`;

const ipv6 = {
  b: raw`\[`,
  content: '[A-Fa-f0-9:]+',
  e: raw`\]`,
};

const urlReg = {
  wProtocol: {
    protocol: group(safeChars, 'protocol'),
    e: ':',
  },
  wAuth: {
    b: '//',
    wUserInfo: optional({
      username: group(safeChars, 'username'),
      wPassword: optional({
        b: ':',
        password: group(safeChars, 'password'),
      }),
      e: '@',
    }),
    wHost: {
      hostname: group(oneOf(safeChars, ipv6), 'hostname'),
      wPort: optional({
        b: ':',
        port: group(raw`\d+`, 'port'),
      }),
    },
  },
  wPath: optional({
    pathname: group(`[${pChar}/]+`, 'pathname'),
    wSearch: optional({
      b: raw`\?`,
      query: optional(group(`[${pChar}/]*`, 'query')),
    }),
  }),
  wHash: optional({
    b: '#',
    hash: group(`[${pChar}/?]*`, 'hash'),
  }),
};

const urlRegExp = objectToRegExp(exact(urlReg));
const authRegExp = objectToRegExp(exact({ ...urlReg.wAuth, b: '' }));
const hostRegExp = objectToRegExp(exact(urlReg.wAuth.wHost));
const pathRegExp = objectToRegExp(exact(urlReg.wPath));
const originRegExp = objectToRegExp(exact([urlReg.wProtocol, '//', urlReg.wAuth.wHost]));

/**
 * url 对象
 * @prop {String} protocol 协议
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
    const {
      protocol, username, password, hostname, port, pathname, query, hash,
    } = matchResult.groups;
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
    const {
      username, password, hostname, port,
    } = matchResult.groups;
    this.username = username;
    this.password = password;
    this.hostname = hostname;
    this.port = port;
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
    const { hostname, port } = matchResult.groups;
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
    const { pathname, query } = matchResult.groups;
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
    const { protocol, hostname, port } = matchResult.groups;
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
