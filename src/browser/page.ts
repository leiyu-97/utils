export function visibleTimeout(callback: () => void, time: number): () => void {
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

export function visibleInterval(
  callback: () => void,
  time: number,
): () => void {
  let clear: () => void;
  function innerCallback() {
    callback();
    clear = visibleTimeout(innerCallback, time);
  }
  clear = visibleTimeout(innerCallback, time);
  return () => {
    clear();
  };
}
