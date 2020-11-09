const fs = require('fs').promises;
const path = require('path');
const babel = require('@babel/core');

function compileRaw(input) {
  return input;
}

async function compileEsm(input) {
  const compiledCode = await babel.transformAsync(input, {
    sourceType: 'module',
    plugins: [
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

async function compile({ input, output, type }) {
  const code = (await fs.readFile(input)).toString();
  let compiledCode;
  switch (type) {
    case 'raw':
      compiledCode = await compileRaw(code, input);
      break;
    case 'esm':
      compiledCode = await compileEsm(code, input);
      break;
    case 'cjs':
      compiledCode = await compileCjs(code, input);
      break;
    default:
      throw new Error('unknown type');
  }
  // 写入
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, compiledCode);
}

module.exports = compile;
