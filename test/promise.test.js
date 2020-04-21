const assert = require('assert');
const { wait, timeout, retry } = require('../src/promise');

describe('promise', () => {
  describe('wait', () => {
    it('调用成功', (done) => {
      wait(1)().then(done);
    });

    it('等待时间正确', (done) => {
      const start = Date.now();
      wait(100)()
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
      timeout(100)(wait(80))().then(done).catch(done);
    });

    it('应该超时', (done) => {
      timeout(80)(wait(100))()
        .then(() => done(new Error()))
        .catch(() => done());
    });
  });

  describe('retry', () => {
    it('成功调用', (done) => {
      retry()(done)();
    });

    it('异步函数成功重试', (done) => {
      let index = 0;
      const func = () => {
        index++;
        return index === 1 ? Promise.reject() : Promise.resolve();
      };
      retry(1)(func)().then(() => {
        done(assert(index === 2));
      }).catch(done);
    });

    it('同步函数成功重试', (done) => {
      let index = 0;
      const func = () => {
        index++;
        if (index === 1) {
          throw new Error();
        }
      };
      retry(1)(func)().then(() => {
        done(assert(index === 2));
      }).catch(done);
    });

    it('重试次数正确', (done) => {
      let index = 0;
      const func = () => {
        index++;
        return index < 10 ? Promise.reject() : Promise.resolve();
      };
      retry(10)(func)().then(() => {
        done(assert(index === 10));
      }).catch(done);
    });

    it('等待时间正确', (done) => {
      let index = 0;
      const func = () => {
        index++;
        return index === 1 ? Promise.reject() : Promise.resolve();
      };
      const start = Date.now();
      retry(1, 100)(func)().then(() => {
        const time = Date.now() - start;
        done(assert(time > 80 && time < 120));
      }).catch(done);
    });
  });
});
