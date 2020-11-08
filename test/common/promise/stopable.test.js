const assert = require('assert');
const { Stopable, wait } = require('../../../src/common/promise');
const { slow: defaultSlow } = require('../.mocharc');

describe('promise', () => {
  describe('Stopable', () => {
    it('正常 resolve', function (done) {
      this.slow(defaultSlow + 100);
      new Stopable((resolve) => setTimeout(resolve, 100)).then(done);
    });

    it('正常 catch', function (done) {
      this.slow(defaultSlow + 100);
      new Stopable((resolve, reject) => setTimeout(reject, 100)).catch(done);
    });

    it('正常 stop', function (done) {
      this.slow(defaultSlow + 200);
      const stopable = new Stopable((resolve) =>
        setTimeout(resolve, 100)).then(() => assert(false));
      stopable.stop();
      wait(200).then(done);
    });

    it('链式调用正常 resolve', function (done) {
      this.slow(defaultSlow + 100);
      const stopable = new Stopable((resolve) => setTimeout(resolve, 100))
        .then(() => null)
        .then(done);
      assert(stopable instanceof Stopable);
    });

    it('链式调用正常 reject', function (done) {
      this.slow(defaultSlow + 200);
      const stopable = new Stopable((resolve) => setTimeout(resolve, 100))
        .catch(() => null)
        .then(() => null)
        .catch(wait(100))
        .then(done);
      assert(stopable instanceof Stopable);
    });

    it('链式调用正常 stop', function (done) {
      this.slow(defaultSlow + 200);
      const stopable = new Stopable((resolve) => setTimeout(resolve, 100))
        .then(() => null)
        .then(() => assert(false));
      stopable.stop();
      assert(stopable instanceof Stopable);
      wait(200).then(done);
    });

    it('传入 promise 对象正常 resolve', function (done) {
      this.slow(defaultSlow + 100);
      new Stopable(wait(100)).then(done);
    });

    it('传入 promise 对象正常 stop', function (done) {
      this.slow(defaultSlow + 200);
      const stopable = new Stopable(wait(100)).then(() => assert(false));
      stopable.stop();
      wait(200).then(done);
    });

    it('resolve promise 对象正常 stop', function (done) {
      this.slow(defaultSlow + 300);
      const stopable = new Stopable((resolve) => resolve(wait(200)))
        .then(() => assert(false));
      wait(100).then(() => stopable.stop());
      wait(300).then(done);
    });

    it('then 接受 promise 对象正常 stop', function (done) {
      this.slow(defaultSlow + 300);
      const stopable = new Stopable((resolve) => resolve())
        .then(() => wait(200))
        .then(() => assert(false));
      wait(100).then(() => stopable.stop());
      wait(300).then(done);
    });

    it('链式调用中返回 Promise 对象时正常 resolve', function (done) {
      this.slow(defaultSlow + 100);
      const start = Date.now();
      new Stopable((resolve) => resolve(wait(100))).then(() => {
        // 确认是否真的等到 wait 结束才 resolve
        assert(Date.now() - start >= 100);
        done();
      });
    });

    it('链式调用中返回 Promise 对象时正常 stop', function (done) {
      this.slow(defaultSlow + 400);
      let thenCalled = false;

      const stopable = new Stopable((resolve) => resolve(wait(100)))
        .then(() => {
          thenCalled = true;
          return wait(200);
        })
        .then(() => assert(false));
      assert(stopable instanceof Stopable);
      wait(200).then(() => stopable.stop());
      wait(400).then(() => {
        // 确认 .then 中的内容确实被执行了
        assert(thenCalled === true);
        done();
      });
    });

    it('从最后 stop 能够阻止', function (done) {
      this.slow(defaultSlow + 400);
      let step = 1;
      const stopable = new Stopable(wait(100));
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

    it('stop 前置能够阻止后续', function (done) {
      this.slow(defaultSlow + 400);
      let step = 1;
      const stopable = new Stopable(wait(100));
      const stopable2 = stopable.then(() => {
        step++;
        return wait(200).then(() => assert(false));
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

    it('若已经结束则无法阻止后续', function (done) {
      this.slow(defaultSlow + 400);
      let step = 1;
      const stopable = new Stopable(wait(100));
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
