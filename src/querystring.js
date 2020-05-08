/**
 * @module querystring
 */

const parse = (query) =>
  query
    .split('&')
    .map((str) => str.split('='))
    .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
    .reduce((prev, [key, value = '']) => ({ ...prev, [key]: value }), {});

const stringify = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => [encodeURIComponent(key), encodeURIComponent(value)])
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

module.exports = {
  parse,
  stringify,
};
