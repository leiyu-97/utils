/**
 * @module regexp
 */
type RegObject = { [key: string]: RegObject | string } | Array<RegObject | string> | string;

/**
 * 将对象的值拼接成字符串
 * @param {Object} obj 待拼接的对象
 * @return {String} 拼接后的字符串
 */
export function objectValuesToString(obj: RegObject): string {
  return Object.values(obj).reduce<string>((prev, cur) => {
    if (typeof cur === 'string') {
      return prev + cur;
    }
    return prev + objectValuesToString(cur);
  }, '');
}

/**
 * 将对象形式的正则表达式转换为正则表达式
 * @param {Object} obj 对象形式的正则表达式
 * @param {String} flags 正则表达式的 flags
 * @return {RegExp} 正则表达式
 */
export function objectToRegExp(obj: RegObject, flags?: string): RegExp {
  return new RegExp(objectValuesToString(obj), flags);
}

/** 可选 */
export function optional(obj: RegObject): RegObject {
  return { b: '(?:', optional: obj, e: ')?' };
}

/** 分组 */
export function group(obj: RegObject, capture: boolean | string = true): RegObject {
  let captureStr: string;
  if (typeof capture === 'string') {
    // 命名捕获
    captureStr = `?<${capture}>`;
  } else if (capture) {
    // 匿名捕获
    captureStr = '';
  } else {
    // 不捕获
    captureStr = '?:';
  }

  return {
    b: '(',
    capture: captureStr,
    group: obj,
    e: ')',
  };
}

/** 匹配其中之一 */
export function oneOf(...objs: RegObject[]): RegObject {
  return {
    b: '(?:',
    oneOf: objs.reduce<RegObject[]>((prev, cur) => {
      if (prev.length) prev.push('|');
      prev.push(cur);
      return prev;
    }, []),
    e: ')',
  };
}

/** 添加首尾限制 */
export function exact(obj: RegObject): RegObject {
  return { b: '^', exact: obj, e: '$' };
}

/** 添加首部限制 */
export function startsWith(obj: RegObject): RegObject {
  return { b: '^', startsWith: obj };
}

/** 添加尾部限制 */
export function endsWith(obj: RegObject): RegObject {
  return { endsWith: obj, e: '$' };
}
