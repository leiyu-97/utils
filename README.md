# utils

[![Build Status](https://travis-ci.org/demonly/utils.svg?branch=master)](https://travis-ci.org/demonly/utils)
[![Coverage Status](https://coveralls.io/repos/github/demonly/utils/badge.svg?branch=master)](https://coveralls.io/github/demonly/utils?branch=master)

## 使用
```shell
# 安装依赖
npm install
# 编译
npm run build
```
编译后 dist 文件夹下会有三个目录，raw、cjs、esm，保存了不同版本的编译后文件。

也可以指定需要使用的模块，将该模块和所有依赖的模块一同编译输出
```shell
npm run build -m common/array -t esm
```