/* eslint-disable no-undef */
const assert = require('assert');
const puppeter = require('puppeteer');
const rollup = require('rollup');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const path = require('path');

const init = async (html, scriptPath) => {
  const bundle = await rollup.rollup({
    input: scriptPath,
    plugins: [resolve(), commonjs()],
  });

  const result = await bundle.generate({ format: 'iife', name: 'dom' });
  const { code } = result.output[0];

  const browser = await puppeter.launch();
  const page = await browser.newPage();
  page.setContent(html);
  page.addScriptTag({ content: code });
  return { browser, page };
};

describe('dom', async () => {
  describe('isChildOf', async () => {
    let browser;
    let page;
    const domStr = `
    <div id="parent">
      <div id="target">
        <div id="child"></div>
      </div>
      <div id="sibling"></div>
    </div>`;
    before(async () => {
      ({ browser, page } = await init(
        domStr,
        path.resolve(__dirname, '../src/dom/index.js'),
      ));
    });

    it('结果正确', async () => {
      const result = await page.evaluate(() => {
        const { isChildOf } = dom;
        const parent = document.getElementById('parent');
        const child = document.getElementById('child');
        const sibling = document.getElementById('sibling');
        const target = document.getElementById('target');
        return [
          isChildOf(target, parent),
          !isChildOf(target, child),
          !isChildOf(target, sibling),
        ];
      });
      assert(result[0]);
      assert(result[1]);
      assert(result[2]);
    });

    after(async () => browser.close());
  });

  describe('isParentOf', async () => {
    let browser;
    let page;
    const domStr = `
    <div id="parent">
      <div id="target">
        <div id="child"></div>
      </div>
      <div id="sibling"></div>
    </div>`;
    before(async () => {
      ({ browser, page } = await init(
        domStr,
        path.resolve(__dirname, '../src/dom/index.js'),
      ));
    });

    it('结果正确', async () => {
      const result = await page.evaluate(() => {
        const { isParentOf } = dom;
        const parent = document.getElementById('parent');
        const child = document.getElementById('child');
        const sibling = document.getElementById('sibling');
        const target = document.getElementById('target');
        return [
          !isParentOf(target, parent),
          isParentOf(target, child),
          !isParentOf(target, sibling),
        ];
      });
      assert(result[0]);
      assert(result[1]);
      assert(result[2]);
    });

    after(async () => browser.close());
  });
});
