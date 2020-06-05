/**
 * @module promise
 */

class Stopable extends Promise {
  /**
   * @summary 能够停止的 Promise
   * @param {Function|Promise} func 传入 Function 时使用方法与 Promise一样，
   * 传入 Promise 时，将 Promise 转为 Stopable
   */
  constructor(func) {
    // 当参数为 promise 对象时改为包裹改 promise 对象
    if (func instanceof Promise) {
      return Stopable.wrap(func);
    }

    let _resolve;
    let _reject;
    // 暴露内部的 resolve 和 reject 方法
    super((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    this._stoped = false;
    this._prev = null;
    this._res = null;
    this._rej = null;

    // 调用方法
    func(
      (...param) => (this._stoped ? undefined : _resolve(...param)),
      (...param) => (this._stoped ? undefined : _reject(...param)),
    );
  }

  /**
   * @summary 同 Promise.then
   * @param {Function} resCb 正常处理回调
   * @param {Function} rejCb 异常处理回调
   * @return {Stopable} Promise
   */
  then(resCb, rejCb) {
    let promise;

    const resolve = resCb ? (...param) => {
      let result = resCb(...param);
      if (result instanceof Promise) {
        result = new Stopable(result);
        promise._res = result;
      }
      return result;
    } : undefined;

    const reject = rejCb ? (...param) => {
      let result = rejCb(...param);
      if (result instanceof Promise) {
        result = new Stopable(result);
        promise._rej = result;
      }
      return result;
    } : undefined;

    promise = super.then.call(this, resolve, reject);
    promise._prev = this;
    return promise;
  }

  /**
   * @summary 同 Promise.catch
   * @param {Function} rejCb 异常处理回调
   * @return {Stopable} Promise
   */
  catch(rejCb) {
    let promise;

    const reject = rejCb ? (...param) => {
      let result = rejCb(...param);
      if (result instanceof Promise) {
        result = new Stopable(result);
        promise._rej = result;
      }
      return result;
    } : undefined;

    promise = super.catch.call(this, reject);
    promise._prev = this;
    return promise;
  }

  /**
   * @summary 停止 promise
   * @return {undefined}
   */
  stop() {
    if (this._prev) this._prev.stop();
    if (this._res) this._res.stop();
    if (this._rej) this._rej.stop();
    this._stoped = true;
  }

  static wrap(promise) {
    return new Stopable(promise.then.bind(promise));
  }
}

module.exports = Stopable;
