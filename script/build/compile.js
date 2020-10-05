const fs = require('fs').promises;
const path = require('path');
const babel = require('@babel/core');

function compileRaw(input) {
  return input;
}

function compileEsm(input, isReact) {
  const compiledCode = babel.transformFileAsync(input, {
    sourceType: 'module',
    plugins: [['@babel/plugin-transform-typescript', { isTSX: isReact }]],
  });
  return compiledCode.code;
}

function compileCjs(input, isReact) {
  const compiledCode = babel.transformFileAsync(input, {
    sourceType: 'module',
    plugins: [
      ['@babel/plugin-transform-typescript', { isTSX: isReact }],
      path.resolve(__dirname, './esm-to-cjs'),
    ],
  });
  return compiledCode.code;
}

async function compile({
  input, output, type, isReact,
}) {
  const code = (await fs.readFile(input)).toString();
  let compiledCode;
  switch (type) {
    case 'raw':
      compiledCode = await compileRaw(code, isReact);
      break;
    case 'esm':
      compiledCode = await compileEsm(code, isReact);
      break;
    case 'cjs':
      compiledCode = await compileCjs(code, isReact);
      break;
    default:
      throw new Error('unknown type');
  }
  // 写入
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, compiledCode);
}

module.exports = compile;
