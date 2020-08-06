const fs = require('fs');
const path = require('path');

const exts = ['.js', '.json'];

function tryFile(requestPath) {
  try {
    return fs.statSync(requestPath).isFile() ? requestPath : false;
  } catch (e) {
    return false;
  }
}

function tryExtensions(p) {
  for (let i = 0; i < exts.length; i++) {
    const filename = tryFile(p + exts[i]);

    if (filename) {
      return filename;
    }
  }
  return false;
}

function tryPackage(requestPath) {
  const filename = path.resolve(requestPath);
  const actual = tryFile(filename)
    || tryExtensions(filename)
    || tryExtensions(path.resolve(filename, 'index'));
  return actual || requestPath;
}

module.exports = {
  tryPackage,
};
