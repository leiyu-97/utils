const assert = require('assert');
const {
  wait,
  timeout,
  retry,
  dynamicAll,
  StopablePromise,
} = require('../src/promise');

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
        .then(() => done(new Error('成功')))
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
          array.push(wait(100).then(() => index++));
        }),
      ];

      dynamicAll(array).then(() => {
        assert(index === 2);
        done();
      });
    });
  });

  describe('StopablePromise', () => {
    it('正常 resolve', (done) => {
      new StopablePromise((resolve) => setTimeout(resolve, 100)).then(done);
    });

    it('正常 catch', (done) => {
      new StopablePromise((resolve, reject) => setTimeout(reject, 100)).catch(done);
    });

    it('正常 stop', (done) => {
      const stopable = new StopablePromise((resolve) =>
        setTimeout(resolve, 100)).then(() => assert(false));
      stopable.stop();
      wait(200).then(done);
    });

    it('链式调用正常 resolve', (done) => {
      const stopable = new StopablePromise((resolve) =>
        setTimeout(resolve, 100))
        .then(() => null)
        .then(done);
      assert(stopable instanceof StopablePromise);
    });

    it('链式调用正常 reject', (done) => {
      const stopable = new StopablePromise((resolve) =>
        setTimeout(resolve, 100))
        .catch(() => null)
        .then(() => null)
        .catch(wait(100))
        .then(done);
      assert(stopable instanceof StopablePromise);
    });

    it('链式调用正常 stop', (done) => {
      const stopable = new StopablePromise((resolve) =>
        setTimeout(resolve, 100))
        .then(() => null)
        .then(() => assert(false));
      stopable.stop();
      assert(stopable instanceof StopablePromise);
      wait(200).then(done);
    });

    it('传入 promise 对象正常 resolve', (done) => {
      new StopablePromise(wait(100)).then(done);
    });

    it('传入 promise 对象正常 stop', (done) => {
      const stopable = new StopablePromise(wait(100)).then(() => assert(false));
      stopable.stop();
      wait(200).then(done);
    });

    it('链式调用中返回 Promise 对象时正常 resolve', (done) => {
      const start = Date.now();
      new StopablePromise((resolve) => resolve(wait(100))).then(() => {
        // 确认是否真的等到 wait 结束才 resolve
        assert(Date.now() - start > 100);
        done();
      });
    });

    it('链式调用中返回 Promise 对象时正常 stop', (done) => {
      let thenCalled = false;

      const stopable = new StopablePromise((resolve) => resolve(wait(100)))
        .then(() => {
          thenCalled = true;
          return wait(200);
        })
        .then(() => assert(false));
      assert(stopable instanceof StopablePromise);
      wait(200).then(() => stopable.stop());
      wait(400).then(() => {
        // 确认 .then 中的内容确实被执行了
        assert(thenCalled === true);
        done();
      });
    });

    it('从最后 stop 能够阻止', (done) => {
      let step = 1;
      const stopable = new StopablePromise(wait(100));
      const stopable2 = stopable.then(() => {
        step++;
        return wait(200);
      });
      const stopable3 = stopable2.then(() => {
        step++;
        return wait(100);
      });

      // 在第二步中间停止
      wait(150).then(() => {
        stopable3.stop();
      });
      wait(400).then(() => {
        assert(step === 2);
        done();
      });
    });

    it('stop 前置能够阻止后续', (done) => {
      let step = 1;
      const stopable = new StopablePromise(wait(100));
      const stopable2 = stopable.then(() => {
        step++;
        return wait(200);
      });
      stopable2.then(() => {
        step++;
        return wait(100);
      });

      // 在第二步中间停止
      wait(150).then(() => {
        stopable2.stop();
      });
      wait(400).then(() => {
        assert(step === 2);
        done();
      });
    });

    it('若已经结束则无法阻止后续', (done) => {
      let step = 1;
      const stopable = new StopablePromise(wait(100));
      const stopable2 = stopable.then(() => {
        step++;
        return wait(200);
      });
      stopable2.then(() => {
        step++;
        return wait(100);
      });

      // 在第二步中间停止
      wait(150).then(() => {
        stopable.stop();
      });
      wait(400).then(() => {
        assert(step === 3);
        done();
      });
    });
  });
});
