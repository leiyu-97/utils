/* eslint-disable no-console */
const fs = require('fs');
const { promisify } = require('util');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');
const { tryPackage } = require('./loader');
const { dynamicAll } = require('../src/promise');

const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

const builtinModules = [
  'assert',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'net',
  'os',
  'path',
  'perf_hooks',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'worker_threads',
  'zlib',
];

const baseDir = path.resolve(__dirname, '../');
const sourceDir = path.join(baseDir, '/src');
const distDir = path.join(baseDir, '/dist');

async function main(entry) {
  const files = new Set();
  const modules = new Set();
  const works = [];

  // 添加需要复制的文件
  async function addFile(module) {
    // 查找实际的文件路径
    const filePath = tryPackage(module);
    files.add(filePath);

    // 读取并解析文件内容
    const contentBuffer = await readFile(filePath);
    const content = contentBuffer.toString();
    const ast = babelParser.parse(content);

    // 查找代码中的 require
    traverse(ast, {
      CallExpression({ node }) {
        if (
          node.callee.name === 'require'
          && node.arguments[0]
          && node.arguments[0].type === 'StringLiteral'
        ) {
          const { value } = node.arguments[0];
          if (value.startsWith('.') || value.startsWith('/')) {
            // 文件模块
            const nextModule = path.resolve(path.dirname(filePath), value);
            if (!files.has(nextModule)) works.push(addFile(nextModule));
          } else if (!builtinModules.includes(value)) {
            // 第三方或内置模块
            const nameArray = value.split('/');
            if (nameArray[0].startsWith('@')) {
              modules.add(`${nameArray[0]}/${nameArray[1]}`);
            } else {
              modules.add(nameArray[0]);
            }
          }
        }
      },
    });
  }

  // 添加入口文件
  entry
    .map((filename) => path.resolve(__dirname, `../src/${filename}`))
    .map(addFile)
    .map(works.push.bind(works));

  await dynamicAll(works);

  // 复制文件
  await mkdir(distDir, { recursive: true });
  await Promise.all(
    [...files].map(async (source) => {
      if (!source.startsWith(sourceDir)) {
        console.error('引用了 src 以外的文件', source);
        return undefined;
      }

      const dist = source.replace(sourceDir, distDir);

      await mkdir(path.dirname(dist), { recursive: true });

      await copyFile(source, dist);

      console.log(source.replace(baseDir, ''), '=>', dist.replace(baseDir, ''));
    }),
  );

  console.log('\n');
  console.log('复制完成');
  console.log('\n');

  if (modules.size) {
    console.log(
      '请在使用的库中运行以下命令: \n',
      'npm install --save',
      [...modules].join(' '),
    );
  }
}

// const entry = process.argv.slice(2);
const entry = ['promise'];
main(entry);
