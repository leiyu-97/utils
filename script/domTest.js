const path = require('path');
const TestSetRunner = require('./TestSetRunner');

const { walk } = require('../src/fs');

const testFileReg = /.+\.test\.js/;
function isTestFile(file) {
  const filename = path.basename(file);
  return testFileReg.test(filename);
}

async function main(files) {
  // 如果没有传入文件，则主动去搜索文件
  if (files.length === 0) {
    files = (await walk(path.resolve(__dirname, '../test/dom'))).filter(isTestFile);
  }
  // 测试
  const runner = new TestSetRunner();
  const passed = await runner.run(files);

  process.exit(passed ? 0 : 1);
}

const entry = process.argv.slice(2);
main(entry);
