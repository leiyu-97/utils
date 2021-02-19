import assert from 'power-assert';
import 'jest-sinon';
import {
  wait,
  timeout,
  retry,
  dynamicAll,
  deduplicate,
} from '../../../src/common/promise';

describe('promise', () => {
  describe('wait', () => {
    it('调用成功', (done) => {
      wait(1).then(done);
    });

    it('等待时间正确', (done) => {
      const start = Date.now();
      wait(100)
        .then(() => {
          const time = Date.now() - start;
          assert(time > 80 && time < 120);
          done();
        })
        .catch(done);
    });
  });

  describe('timeout', () => {
    it('应该未超时', (done) => {
      timeout(wait, 100)(80).then(done).catch(done);
    });

    it('应该超时', (done) => {
      timeout(
        wait,
        80,
      )(100)
        .then(() => done(new Error()))
        .catch(() => done());
    });
  });

  describe('retry', () => {
    it('函数应该被调用', (done) => {
      retry(done)();
    });

    it('异步函数成功', (done) => {
      const func = () => Promise.resolve();
      retry(func)()
        .then(() => done())
        .catch(() => done(new Error('失败')));
    });

    it('同步函数成功', (done) => {
      const func = () => null;
      retry(func)()
        .then(() => done())
        .catch(() => done(new Error('失败')));
    });

    it('异步函数失败', (done) => {
      const func = Promise.resolve;
      retry(func)()
        .then(() => done(new Error('成功')))
        .catch(() => done());
    });

    it('同步函数失败', (done) => {
      const func = () => {
        throw new Error();
      };
      retry(func)()
        .then(() => done(false))
        .catch(() => done());
    });

    it('异步函数重试次数正确', (done) => {
      let index = 0;
      const func = () => {
        index++;
        return Promise.reject();
      };
      retry(func, 10)()
        .then(() => done(new Error('成功')))
        .catch(() => done(assert(index === 11)));
    });

    it('同步函数重试次数正确', (done) => {
      let index = 0;
      const func = () => {
        index++;
        throw new Error();
      };
      retry(func, 10)()
        .then(() => done(new Error('成功')))
        .catch(() => done(assert(index === 11)));
    });

    it('等待时间正确', (done) => {
      let index = 0;
      const func = () => {
        index++;
        return index === 1 ? Promise.reject() : Promise.resolve();
      };
      const start = Date.now();
      retry(func, 1, 100)()
        .then(() => {
          const time = Date.now() - start;
          done(assert(time > 80 && time < 120));
        })
        .catch(done);
    });
  });

  describe('dynamicAll', () => {
    it('resolve 时机正确', (done) => {
      let index = 0;
      const array = [
        wait(100).then(() => {
          index++;
          array.push(wait(100).then(() => {
            index++;
          }));
        }),
      ];

      dynamicAll(array).then(() => {
        assert(index === 2);
        done();
      });
    });
  });

  describe('deduplicate', () => {
    it('正常执行', (done) => {
      let index = 0;
      const func = () => wait(100).then(() => index++);
      const deduplicateFunc = deduplicate(func);
      deduplicateFunc();
      wait(150).then(() => {
        assert(index === 1);
        done();
      });
    });

    it('没有并行执行', (done) => {
      let index = 0;
      const func = () => wait(100).then(() => index++);
      const deduplicateFunc = deduplicate(func);
      deduplicateFunc();
      deduplicateFunc();
      wait(150).then(() => {
        assert(index === 1);
        done();
      });
    });

    it('执行完成后仍然可以执行', (done) => {
      let index = 0;
      const func = () => wait(100).then(() => { index++; });
      const deduplicateFunc = deduplicate(func);
      deduplicateFunc();
      wait(150).then(deduplicateFunc);
      wait(300).then(() => {
        assert(index === 2);
        done();
      });
    });
  });
});
