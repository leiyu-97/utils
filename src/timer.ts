interface Handler {
  time: number;
  callback: () => void;
  t: ReturnType<typeof setTimeout> | null;
}
/**
 * 计时器
 */
class Timer {
  /** 最后一次的开始时间 */
  private startTime = 0;

  /** 累积时间 */
  private accumulationTime = 0;

  /** 是否在计时中 */
  public running = false;

  /** 是否开始过计时 */
  public started = false;

  handlers: Map<ReturnType<typeof setTimeout>, Handler> = new Map();

  start(): void {
    if (this.running) return;
    // 启动所有 handlers
    const curTime = this.getTime();
    Array.from(this.handlers.values()).forEach((handler) => {
      const { callback, time } = handler;
      handler.t = setTimeout(callback, time - curTime);
    });
    // 启动计时器
    this.startTime = Date.now();
    this.started = true;
    this.running = true;
  }

  pause(): void {
    if (!this.running) return;
    // 暂停计时器
    this.accumulationTime += Date.now() - this.startTime;
    this.running = false;
    // 暂停所有 handlers
    Array.from(this.handlers.values()).forEach((handler) => {
      clearTimeout(handler.t);
      handler.t = null;
    });
  }

  reset(): void {
    this.pause();
    this.handlers.clear();
    this.accumulationTime = 0;
    this.started = false;
  }

  restart(): void {
    this.reset();
    this.start();
  }

  private setHandler(handler: Handler): void {
    const { time, t, callback } = handler;
    if (this.running) {
      handler.t = setTimeout(callback, time - this.getTime());
    }

    this.handlers.set(t, handler);
  }

  /**
   * 设置一段时间后执行 callback
   * @param {Function} callback callback 第一个参数为计时器记录的时间（并非从调用 setTimeout 开始记录的时间）
   * @param {Number} time 时间
   * @return {undefined}
   */
  setTimeout(callback: (time: number) => void, time: number): ReturnType<typeof setTimeout> {
    const t = setTimeout(() => null, time);
    const wrappedCallback = () => {
      callback(this.getTime());
      this.handlers.delete(t);
    };
    this.setHandler({ callback: wrappedCallback, time: this.getTime() + time, t });
    return t;
  }

  /**
   * 每隔一段时间执行一次 callback
   * @param {Function} callback callback 第一个参数为计时器记录的时间（并非从调用 setInterval 开始记录的时间）
   * @param {Number} time 时间
   * @return {undefined}
   */
  setInterval(callback: (time: number) => void, time: number): ReturnType<typeof setTimeout> {
    const t = setTimeout(() => null, time);
    let nextTime = time + this.getTime();
    const wrappedCallback = () => {
      nextTime += time;
      this.setHandler({ callback: wrappedCallback, time: nextTime, t });
      callback(this.getTime());
    };
    this.setHandler({ callback: wrappedCallback, time: nextTime, t });
    return t;
  }

  clearTimeout(rowT: ReturnType<typeof setTimeout>): void {
    const { t } = this.handlers.get(rowT) || {};
    this.handlers.delete(rowT);
    if (t === null) return;
    clearTimeout(t);
  }

  clearInterval(rowT: ReturnType<typeof setTimeout>): void {
    this.clearTimeout(rowT);
  }

  getTime(): number {
    if (!this.started) return 0;
    let time = this.accumulationTime;
    if (this.running) time += Date.now() - this.startTime;
    return time;
  }

  getRestTime(t: ReturnType<typeof setTimeout>): null | number {
    const handler = this.handlers.get(t);
    if (!handler) return null;
    return handler.time - this.getTime();
  }
}

export default Timer;
