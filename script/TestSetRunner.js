const fs = require('fs').promises;
const path = require('path');
const puppeter = require('puppeteer');
const TestRunner = require('./TestRunner');

class TestSetRunner {
  constructor({ debug } = {}) {
    this.debug = debug;
  }

  async run(testSet) {
    const { debug } = this;
    // 启动浏览器
    let browser;
    if (debug) {
      browser = await puppeter.launch({
        headless: false,
        devtools: true,
        slowMo: 250,
      });
    } else {
      browser = await puppeter.launch({});
    }

    const results = await Promise.all(
      testSet.map(async (file) => {
        const dir = path.dirname(file);
        const html = `${dir}/index.html`;
        const htmlStat = await fs.stat(html);
        if (!htmlStat || htmlStat.isDirectory()) {
          throw new Error(`${html} 不存在`);
        }
        const runner = new TestRunner({ browser, debug });
        await runner.init(file, html);
        return runner.run();
      }),
    );

    // 关闭浏览器
    await browser.close();

    return results.every((passed) => passed);
  }
}

module.exports = TestSetRunner;
