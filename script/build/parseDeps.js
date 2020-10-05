const fs = require('fs');
const { promisify } = require('util');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');
const { tryPackage } = require('./loader');
const { dynamicAll } = require('../utils');

const readFile = promisify(fs.readFile);

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

async function parseDeps(modules) {
  const files = new Set();
  const externals = new Set();
  const works = [];

  // 添加需要复制的文件
  async function addFile(module) {
    // 查找实际的文件路径
    const filePath = tryPackage(module);
    files.add(filePath);

    // 读取并解析文件内容
    const contentBuffer = await readFile(filePath);
    const content = contentBuffer.toString();
    const ast = babelParser.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    // 处理依赖
    function parseSource(value) {
      if (value.startsWith('.') || value.startsWith('/')) {
        // 文件模块
        const nextModule = path.resolve(path.dirname(filePath), value);
        if (!files.has(nextModule)) works.push(addFile(nextModule));
      } else if (!builtinModules.includes(value)) {
        // 第三方或内置模块
        const nameArray = value.split('/');
        if (nameArray[0].startsWith('@')) {
          externals.add(`${nameArray[0]}/${nameArray[1]}`);
        } else {
          externals.add(nameArray[0]);
        }
      }
    }

    // 查找代码中的 require 和 import
    traverse(ast, {
      CallExpression({ node }) {
        if (
          node.callee.name !== 'require'
          || !node.arguments[0]
          || node.arguments[0].type !== 'StringLiteral'
        ) {
          return;
        }
        parseSource(node.arguments[0].value);
      },
      ExportAllDeclaration({ node }) {
        if (!node.source || node.source.type !== 'StringLiteral') return;
        parseSource(node.source.value);
      },
      ExportNamedDeclaration({ node }) {
        if (!node.source || node.source.type !== 'StringLiteral') return;
        parseSource(node.source.value);
      },
      ImportDeclaration({ node }) {
        if (!node.source || node.source.type !== 'StringLiteral') return;
        parseSource(node.source.value);
      },
    });
  }

  // 添加入口文件
  modules
    .map((filename) =>
      addFile(filename).catch((error) => {
        console.error(`${filename} parse failed`);
        throw error;
      }))
    .map(works.push.bind(works));

  await dynamicAll(works);

  return { files: Array.from(files), externals: Array.from(externals) };
}

module.exports = parseDeps;
