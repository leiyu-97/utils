const TestSetRunner = require('./TestSetRunner');

async function main(files) {
  // 如果没有传入文件，则主动去搜索文件
  if (files.length === 0) {
    throw new Error('请传入测试文件');
  }

  // 测试
  const runner = new TestSetRunner({ debug: true });
  const passed = await runner.run(files);

  process.exit(passed ? 0 : 1);
}

const entry = process.argv.slice(2);
main(entry);
