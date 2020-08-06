const fs = require('fs').promises;
const path = require('path');
const babel = require('@babel/core');
const rollup = require('rollup');
const rollupResolve = require('@rollup/plugin-node-resolve').default;
const rollupCommonjs = require('@rollup/plugin-commonjs');
const rollupIstanbul = require('rollup-plugin-istanbul');
const puppeteer = require('puppeteer');
const uuid = require('uuid');

async function bundleScript(scriptPath, debug) {
  let bundle;
  if (debug) {
    // debug 模式下禁用 espower 和 instrument
    bundle = await rollup.rollup({
      input: [scriptPath],
      onwarn: () => null,
      plugins: [
        rollupResolve(),
        rollupCommonjs(),
        process.env.NYC_CONFIG && rollupIstanbul(),
      ],
    });
  } else {
  // 使用 babel 将测试代码 espowerfy，放到 buildTemp 目录下
    const result = await babel.transformFileAsync(scriptPath, {
      plugins: ['babel-plugin-espower'],
    });
    const sourceDir = path.dirname(scriptPath);
    const targetDir = path
      .resolve(sourceDir)
      .replace(
        path.resolve(__dirname, '../test'),
        path.resolve(__dirname, '../buildTemp'),
      );
    await fs.mkdir(targetDir, { recursive: true });
    const target = `${targetDir}/${path.basename(scriptPath)}`;
    await fs.writeFile(target, result.code);
    // 打包测试代码
    bundle = await rollup.rollup({
      input: [target],
      onwarn: () => null,
      plugins: [
        rollupResolve(),
        rollupCommonjs(),
        process.env.NYC_CONFIG && rollupIstanbul(),
      ],
    });
  }

  const {
    output: [output],
  } = await bundle.generate({
    format: 'iife',
    name: 'dom',
    globals: { assert: 'assert' },
  });
  const { code } = output;
  return code;
}

async function runTest(scriptPath, htmlPath, { browser, debug = false } = {}) {
  // 如果没有传入 browser，则打开一个
  const shouldCloseBrowser = !browser;
  if (!browser) {
    browser = puppeteer.launch();
  }

  const code = await bundleScript(scriptPath, debug);

  const page = await browser.newPage();
  // html
  const html = (await fs.readFile(htmlPath)).toString();
  await page.setContent(html);
  // 监听输出
  await page.exposeFunction('$consoleLog', console.log);
  await page.exposeFunction('$consoleError', console.error);
  await page.exposeFunction('$consoleWarn', console.warn);
  await page.addScriptTag({
    path: path.resolve(__dirname, './mock.browser.js'),
  });

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    async function endTest({ coverage, passed, error }) {
      if (error) {
        return reject(error);
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

      // 关闭页面
      await page.close();
      // 关闭浏览器
      if (shouldCloseBrowser) {
        await browser.close();
      }

      return resolve(passed);
    }

    // 监听测试结果
    await page.exposeFunction('$endTest', endTest);
    // mocha 依赖
    await page.addScriptTag({
      path: path.resolve(__dirname, '../node_modules/mocha/mocha.js'),
    });
    await page.addScriptTag({
      path: path.resolve(
        __dirname,
        '../node_modules/power-assert/build/power-assert.js',
      ),
    });
    await page.addScriptTag({
      content: 'mocha.setup({ ui: "bdd", reporter: "spec", color: true });',
    });
    // 测试代码
    await page.addScriptTag({ content: code });
    await page.evaluate(() => { debugger; });
    // 启动测试
    await page.addScriptTag({
      path: path.resolve(__dirname, './runTest.browser.js'),
    });
  });
}

module.exports = runTest;
