/**
 * 由于在编译时无法使用 src 中的工具方法，因此需要复制出来
 */
const fs = require('fs').promises;
const path = require('path');

function deepFlatten(array) {
  return [].concat(
    ...array.map((v) => (Array.isArray(v) ? deepFlatten(v) : v)),
  );
}

async function dynamicAll(array) {
  let { length } = array;
  let result;
  while (true) {
    result = await Promise.all(array); // eslint-disable-line no-await-in-loop
    if (array.length === length) {
      break;
    }
    length = array.length;
  }
  return result;
}

async function walk(dir) {
  const list = await fs.readdir(dir);
  const tasks = list.map(async (file) => {
    file = path.resolve(dir, file);
    const fileStat = await fs.stat(file);
    if (fileStat && fileStat.isDirectory()) {
      return walk(file);
    }
    return file;
  });
  return Promise.all(tasks).then(deepFlatten);
}

function unentriesReducer(prev, [key, value]) {
  // 为了 reduce 可以不传入第二个参数而做的兼容
  if (prev instanceof Array) prev = unentriesReducer({}, prev);
  prev[key] = value;
  return prev;
}

module.exports = {
  walk,
  dynamicAll,
  unentriesReducer,
};
