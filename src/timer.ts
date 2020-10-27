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

  private innerSetTimeout(
    callback: () => void,
    time: number,
    t: ReturnType<typeof setTimeout>,
  ): void {
    const handler = {
      time: this.getTime() + time,
      callback,
      t: null,
    };

    if (this.running) {
      handler.t = setTimeout(handler.callback, time);
    }

    this.handlers.set(t, handler);
  }

  setTimeout(callback: () => void, time: number): ReturnType<typeof setTimeout> {
    const t = setTimeout(() => null, time);
    this.innerSetTimeout(
      () => {
        callback();
        this.handlers.delete(t);
      },
      time,
      t,
    );
    return t;
  }

  setInterval(callback: () => void, time: number): ReturnType<typeof setTimeout> {
    const t = setTimeout(() => null, time);
    const wrappedCallback = () => {
      callback();
      this.innerSetTimeout(callback, time, t);
    };
    this.innerSetTimeout(wrappedCallback, time, t);
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
}

export default Timer;
