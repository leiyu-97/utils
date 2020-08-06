const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const puppeter = require('puppeteer');

const { walk } = require('../src/fs');
const runTest = require('./runTest');

const stat = promisify(fs.stat);

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
  // 启动浏览器
  const browser = await puppeter.launch({});
  // 测试
  const tasks = files.map(async (file) => {
    const dir = path.dirname(file);
    const html = `${dir}/index.html`;
    const htmlStat = await stat(html);
    if (!htmlStat || htmlStat.isDirectory()) {
      throw new Error(`${html} 不存在`);
    }
    return runTest(file, html, browser);
  });
  const result = await Promise.all(tasks);
  // 关闭浏览器
  await browser.close();

  process.exit(result.every((passed) => passed === true) ? 0 : 1);
}

const entry = process.argv.slice(2);
main(entry);
