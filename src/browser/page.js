function visibleTimeout(callback, time) {
  let startTime = Date.now();
  let t;

  function clear() {
    clearTimeout(t);
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('visibilitychange', handleVisibilitychange);
  }

  function handleHide() {
    clearTimeout(t);
    const waitedTime = Date.now() - startTime;
    time -= waitedTime;
  }

  function handleShow() {
    startTime = Date.now();
    t = setTimeout(() => {
      callback();
      clear();
    }, time);
  }

  function handleVisibilitychange() {
    (document.hidden ? handleHide : handleShow)();
  }
  handleVisibilitychange();
  window.addEventListener('visibilitychange', handleVisibilitychange);
  return clear;
}

function visibleInterval(callback, time) {
  let clear;
  function innerCallback() {
    callback();
    clear = visibleTimeout(innerCallback, time);
  }
  clear = visibleTimeout(innerCallback, time);
  return () => {
    clear();
  };
}

module.exports = {
  visibleTimeout,
  visibleInterval,
};
