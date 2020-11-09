const fs = require('fs').promises;
const path = require('path');
const babel = require('@babel/core');
const vueTemplateCompiler = require('vue-template-compiler');
const vueCompiler = require('@vue/component-compiler-utils');

const baseDir = path.resolve(__dirname, '../../src/');

// 编译黑名单
const blackList = {
  raw: [],
  esm: ['common/typescript', 'types', 'node'],
  cjs: ['common/typescript', 'types', 'vue', 'react'],
};

function compileRaw(input) {
  return input;
}

async function compileEsm(input) {
  const compiledCode = await babel.transformAsync(input, {
    sourceType: 'module',
    plugins: [
      path.resolve(__dirname, './decorators'),
      path.resolve(__dirname, './enum-to-object'),
      ['@babel/plugin-transform-typescript', { isTSX: true }],
    ],
  });
  return compiledCode.code;
}

async function compileCjs(input) {
  const compiledCode = await babel.transformAsync(input, {
    sourceType: 'module',
    plugins: [
      path.resolve(__dirname, './enum-to-object'),
      ['@babel/plugin-transform-typescript', { isTSX: true }],
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      path.resolve(__dirname, './esm-to-cjs'),
    ],
  });
  return compiledCode.code;
}

function stringifyBlock({ type, attrs, content }) {
  const attrStr = Object.entries(attrs)
    .map(([key, value]) => (value === true ? `${key}` : `${key}="${value}"`))
    .map((str) => ` ${str}`)
    .join('');
  return `<${type}${attrStr}>\n${content.trim()}\n<${type}/>`;
}

function stringfiyDescripter({ template, script, styles }) {
  return [stringifyBlock(template), stringifyBlock(script), ...styles.map(stringifyBlock)].join('\n');
}

// 编译 js 代码
async function compile(code, type) {
  switch (type) {
    case 'raw':
      return compileRaw(code);
    case 'esm':
      return compileEsm(code);
    case 'cjs':
      return compileCjs(code);
    default:
      throw new Error('unknown type');
  }
}

// 编译并写入文件
async function compileTo({ input, output, type }) {
  if (blackList[type].some((dir) => input.startsWith(path.join(baseDir, dir)))) return;

  const code = (await fs.readFile(input)).toString();
  let compiledCode;
  switch (path.extname(input)) {
    case '.vue':
      {
        const descripter = vueCompiler.parse({
          source: code,
          compiler: vueTemplateCompiler,
          needMap: false,
        });
        const { script = {} } = descripter;
        const { content = '' } = script;
        script.content = await compile(content, type);
        delete script.attrs.lang;
        compiledCode = stringfiyDescripter({ ...descripter, script });
      }
      break;
    default:
      compiledCode = await compile(code, type);
  }
  // 写入
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, compiledCode);
}

module.exports = compileTo;
