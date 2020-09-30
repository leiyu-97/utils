/**
 * @module promise
 */

type Resolve<Result> = (value?: Result | PromiseLike<Result>) => void;
type Then<Param, Result> = (value: Param) => Result | PromiseLike<Result>;

export default class Stopable<Result> extends Promise<Result> {
  private _stoped: boolean;

  private _prev: Stopable<any>;

  private _res: Stopable<Result>;

  private _rej: Stopable<Result>;

  /**
   * @summary 能够停止的 Promise
   * @param {Function|Promise} func 传入 Function 时使用方法与 Promise一样，
   * 传入 Promise 时，将 Promise 转为 Stopable
   */
  constructor(
    func: ((res: Resolve<Result>, rej: Resolve<Result>) => void) | Promise<any>,
  ) {
    // 当参数为 promise 对象时改为包裹改 promise 对象
    if (func instanceof Promise) {
      return Stopable.wrap(func);
    }

    let _resolve: (value?: Result | PromiseLike<Result>) => void | undefined;
    let _reject: (value?: Result | PromiseLike<Result>) => void | undefined;
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
      (param) => {
        if (this._stoped) return undefined;
        if (param instanceof Promise) {
          param = new Stopable(param);
          this._res = <Stopable<Result>>param;
        }
        return _resolve(param);
      },
      (param) => {
        if (this._stoped) return undefined;
        if (param instanceof Promise) {
          param = new Stopable(param);
          this._rej = <Stopable<Result>>param;
        }
        return _reject(param);
      },
    );
  }

  /**
   * @summary 同 Promise.then
   * @param {Function} resCb 正常处理回调
   * @param {Function} rejCb 异常处理回调
   * @return {Stopable} Promise
   */
  then<ThenResult1, ThenResult2>(
    resCb: Then<Result, ThenResult1>,
    rejCb: Then<Result, ThenResult2>,
  ): Stopable<ThenResult1 | ThenResult2> {
    let promise: Stopable<ThenResult1 | ThenResult2>;

    const resolve = resCb
      ? (...param: [Result]) => {
        if (promise._stoped) return new Promise(() => null);
        let result = resCb(...param);
        if (result instanceof Promise) {
          result = new Stopable(result);
          promise._res = <Stopable<ThenResult1>>result;
        }
        return result;
      }
      : undefined;

    const reject = rejCb
      ? (...param: [Result]) => {
        if (promise._stoped) return new Promise(() => null);
        let result = rejCb(...param);
        if (result instanceof Promise) {
          result = new Stopable(result);
          promise._rej = <Stopable<ThenResult2>>result;
        }
        return result;
      }
      : undefined;

    // Promise.prototype.then 会取出 this 的 constructor
    // 然后使用这个 constructor 来新建 Promise 对象
    // 因此这里的 promise 也是 Stopable 类型
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    promise = super.then.call(this, resolve, reject);
    promise._prev = this;
    return promise;
  }

  /**
   * @summary 同 Promise.catch
   * @param {Function} rejCb 异常处理回调
   * @return {Stopable} Promise
   */
  catch<CatchResult>(rejCb: Then<Result, CatchResult>): Stopable<CatchResult> {
    let promise: Stopable<CatchResult>;

    const reject = rejCb
      ? (...param: [Result]) => {
        let result = rejCb(...param);
        if (result instanceof Promise) {
          result = new Stopable(result);
          promise._rej = <Stopable<CatchResult>>result;
        }
        return result;
      }
      : undefined;

    promise = super.catch.call(this, reject);
    promise._prev = this;
    return promise;
  }

  /**
   * @summary 停止 promise
   * @return {undefined}
   */
  stop(): void {
    if (this._prev) this._prev.stop();
    if (this._res) this._res.stop();
    if (this._rej) this._rej.stop();
    this._stoped = true;
  }

  static wrap<Result>(promise: Promise<Result>): Stopable<Result> {
    return new Stopable(Promise.prototype.then.bind(promise));
  }
}
