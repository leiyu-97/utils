/* istanbul ignore file */
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const rollup = require('rollup');
const rollupResolve = require('@rollup/plugin-node-resolve').default;
const rollupCommonjs = require('@rollup/plugin-commonjs');
const rollupIstanbul = require('rollup-plugin-istanbul');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

async function runTest(scriptPath, htmlPath, browser) {
  // 打包测试代码
  const bundle = await rollup.rollup({
    input: [scriptPath],
    onwarn: () => null,
    plugins: [
      rollupResolve(),
      rollupCommonjs(),
      process.env.NYC_CONFIG && rollupIstanbul(),
    ],
  });
  const {
    output: [output],
  } = await bundle.generate({
    format: 'iife',
    name: 'dom',
    globals: { assert: 'assert' },
  });
  const { code } = output;

  const page = await browser.newPage();
  // html
  const html = fs.readFileSync(htmlPath).toString();
  await page.setContent(html);
  // 监听输出
  await page.exposeFunction('$consoleLog', console.log);
  await page.exposeFunction('$consoleError', console.error);
  await page.exposeFunction('$consoleWarn', console.warn);
  await page.addScriptTag({
    path: path.resolve(__dirname, './browser-mock.js'),
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
          await mkdir('./.nyc_output');
        } catch (err) {
          if (err.code !== 'EEXIST') {
            ableToWriteFile = false;
          }
        }

        if (ableToWriteFile) {
          await writeFile(
            './.nyc_output/dom-coverage.json',
            JSON.stringify(coverage),
          );
        }
      }

      // 关闭页面
      await page.close();

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
    // 启动测试
    await page.addScriptTag({
      path: path.resolve(__dirname, './browser-runTest.js'),
    });
  });
}

module.exports = runTest;