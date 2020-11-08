/**
 * @module querystring
 */
interface Query {
  [key: string]: string | undefined;
}

/**
 * 解析查询字符串
 * @param {String} query 待解析的查询字符串
 * @return {Object} 查询对象
 */
export function parse(query: string): Query {
  return query
    .split('&')
    .map((str: string) => str.split('='))
    .map(([key, value = '']) => [
      decodeURIComponent(key),
      decodeURIComponent(value),
    ])
    .reduce(
      (prev: Query, [key, value]: [string, string | undefined]) => ({
        ...prev,
        [key]: value,
      }),
      {},
    );
}

/**
 * 将对象转换为查询字符串
 * @param {Object} obj 查询对象
 * @return {String} 查询字符串
 */
export function stringify(obj: Query): string {
  return Object.entries(obj)
    .map(([key, value = '']) => [
      encodeURIComponent(key),
      encodeURIComponent(value),
    ])
    .map(([key, value]) => (value ? `${key}=${value}` : key))
    .join('&');
}
