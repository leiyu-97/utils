class DelayLogger {
  constructor() {
    this.data = [];
  }

  log(...content) {
    this.data.push({ type: 'log', content });
  }

  warn(...content) {
    this.data.push({ type: 'warn', content });
  }

  error(...content) {
    this.data.push({ type: 'error', content });
  }

  output() {
    while (this.data.length) {
      const { type, content } = this.data.shift();
      console[type](...content);
    }
  }
}

module.exports = DelayLogger;
