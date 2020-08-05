const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { deepFlatten } = require('./array');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function walk(dir) {
  const list = await readdir(dir);
  const tasks = list.map(async (file) => {
    file = path.resolve(dir, file);
    const fileStat = await stat(file);
    if (fileStat && fileStat.isDirectory()) {
      return walk(file);
    }
    return file;
  });
  return Promise.all(tasks).then(deepFlatten);
}

module.exports = {
  walk,
};
