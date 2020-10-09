const fs = require('fs').promises;
const path = require('path');
const babel = require('@babel/core');
const rollup = require('rollup');
const rollupResolve = require('@rollup/plugin-node-resolve').default;
const rollupCommonjs = require('@rollup/plugin-commonjs');
const rollupIstanbul = require('rollup-plugin-istanbul');
const rollupTypescript = require('@rollup/plugin-typescript');
const puppeteer = require('puppeteer');
const uuid = require('uuid');
const { EventEmitter } = require('events');

async function bundleScript(scriptPath, debug) {
  const basename = path.basename(scriptPath);
  const rootDir = path.resolve(__dirname, '../../');
  const sourceDir = `${rootDir}/test`;
  const targetDir = `${rootDir}/buildTemp`;
  const serverDir = 'http://localhost:3000/buildTemp';
  const targetPath = scriptPath.replace(sourceDir, targetDir);
  const serverPath = scriptPath.replace(sourceDir, serverDir);

  let result = {};

  const bundle = await rollup.rollup({
    input: [scriptPath],
    onwarn: () => null,
    plugins: [
      rollupResolve(),
      rollupCommonjs(),
      rollupTypescript(),
      process.env.NYC_CONFIG && rollupIstanbul(),
    ],
  });

  ({
    output: [result],
  } = await bundle.generate({
    format: 'iife',
    globals: { assert: 'assert', mocha: 'Mocha' },
    sourcemap: true,
  }));

  // espower 与 istanbul 有冲突，不能同时使用
  if (!process.env.NYC_CONFIG) {
    result = await babel.transformAsync(result.code, {
      plugins: ['babel-plugin-espower'],
      inputSourceMap: result.map,
    });
  }
  result.map.sources = result.map.sources.map((url) =>
    path.relative(path.dirname(targetPath), `${rootDir}/${url}`));
  if (debug) {
    result.code = `debugger;${result.code}`;
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(
    targetPath,
    `${result.code}//# sourceMappingURL=${basename}.map`,
  );
  await fs.writeFile(`${targetPath}.map`, JSON.stringify(result.map));

  return serverPath;
}

class TestRunner extends EventEmitter {
  constructor({ browser, debug = false } = {}) {
    super();
    this.debug = debug;
    this.browser = browser;
  }

  async init(scriptPath, htmlPath) {
    // 如果没有传入 browser，则打开一个
    if (!this.browser) {
      const browser = await puppeteer.launch();
      this.ownBrowser = browser;
      this.browser = browser;
    }
    // 开启测试页面
    const page = await this.browser.newPage();
    this.page = page;
    // html
    const html = (await fs.readFile(htmlPath)).toString();
    await page.setContent(html);
    // 暴露方法
    await Promise.all([
      // page 和 browser 方法
      page.exposeFunction('$execPageCommand', this.execPageCommand.bind(this)),
      page.exposeFunction(
        '$execBrowserCommand',
        this.execBrowserCommand.bind(this),
      ),
      // 控制台输出方法
      page.exposeFunction('$consoleLog', console.log),
      page.exposeFunction('$consoleError', console.error),
      page.exposeFunction('$consoleWarn', console.warn),
      // 测试结果输出方法
      page.exposeFunction('$endTest', this.endTest.bind(this)),
    ]);
    // 监听输出
    await page.addScriptTag({
      path: path.resolve(__dirname, './mock.browser.js'),
    });
    await Promise.all([
      // 引入 mocha
      page.addScriptTag({
        path: path.resolve(__dirname, '../../node_modules/mocha/mocha.js'),
      }),
      // 引入 power-assert
      page.addScriptTag({
        path: path.resolve(
          __dirname,
          '../../node_modules/power-assert/build/power-assert.js',
        ),
      }),
    ]);
    await page.addScriptTag({
      path: path.resolve(__dirname, './mochaSetup.browser.js'),
    });
    // 初始化测试代码
    const url = await bundleScript(scriptPath, this.debug);
    await page.addScriptTag({ url });
  }

  run() {
    return new Promise((resolve, reject) => {
      // 监听结果
      this.on('error', reject);
      this.on('finish', resolve);
      // 启动测试
      this.page.addScriptTag({
        path: path.resolve(__dirname, './runTest.browser.js'),
      });
    });
  }

  async endTest({
    coverage, passed, error, stats,
  }) {
    // debug 模式下不结束测试，而是保持浏览器打开
    if (this.debug) {
      return undefined;
    }
    if (error) {
      this.emit('error', error);
    }

    if (coverage) {
      let ableToWriteFile = true;
      try {
        await fs.mkdir('./.nyc_output');
      } catch (err) {
        if (err.code !== 'EEXIST') {
          ableToWriteFile = false;
        }
      }

      if (ableToWriteFile) {
        await fs.writeFile(
          `./.nyc_output/${uuid.v4()}.json`,
          JSON.stringify(coverage),
        );
      }
    }

    // 清除页面或浏览器
    await this.clean();

    this.emit('finish', { passed, stats });
    return passed;
  }

  async clean() {
    // 关闭页面
    await this.page.close();
    // 关闭浏览器
    if (this.ownBrowser) {
      await this.ownBrowser.close();
    }
  }

  async execPageCommand({ name, args }) {
    return this.page[name](...args);
  }

  async execBrowserCommand({ name, args }) {
    return this.browser[name](...args);
  }
}

module.exports = TestRunner;
