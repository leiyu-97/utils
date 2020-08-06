const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const puppeter = require('puppeteer');

const runTest = require('./mocha-puppeteer');

const stat = promisify(fs.stat);

async function main(files) {
  // 如果没有传入文件，则主动去搜索文件
  if (files.length === 0) {
    throw new Error('请传入测试文件');
  }
  // 启动浏览器
  const browser = await puppeter.launch({ headless: false, devtools: true, slowMo: 250 });
  // 测试
  const tasks = files.map(async (file) => {
    const dir = path.dirname(file);
    const html = `${dir}/index.html`;
    const htmlStat = await stat(html);
    if (!htmlStat || htmlStat.isDirectory()) {
      throw new Error(`${html} 不存在`);
    }
    return runTest(file, html, { browser, debug: true });
  });
  const result = await Promise.all(tasks);
  // 关闭浏览器
  await browser.close();

  process.exit(result.every((passed) => passed === true) ? 0 : 1);
}

const entry = process.argv.slice(2);
main(entry);
