/**
 * @module function
 */

const RECURSOR = Symbol('recursor');

/**
 * @static
 * @tutorial recurToIter
 * @summary 将递归函数转化为迭代函数
 * @param {Function} func 递归函数
 * @return {Function} 迭代函数
 */
function recurToIter(func) {
  const tasks = []; // 递归任务栈
  const iterators = []; // 正在等待返回的任务栈
  const results = []; // 结果栈

  // 传入函数中作为迭代函数的替代
  const recursor = (...task) => {
    tasks.push(task);
    return RECURSOR;
  };

  // 执行 iterator 的 next 方法并处理结果
  const next = (iterator, preResult) => {
    while (true) {
      const result = iterator.next(preResult);

      // 内部函数调用了 recursor，暂停执行并将 iterator 推入 iterators
      if (result.value === RECURSOR) {
        iterators.push(iterator);
        break;
      }

      // 内部函数返回了最终结果，将结果推入 results
      if (result.done) {
        results.push(result.value);
        break;
      }

      // 内部函数进行了一次没有意义的 yield，继续 next
      preResult = result.value;
    }
  };

  return (...params) => {
    // 初始化任务
    tasks.push(params);

    while (tasks.length) {
      // 处理 tasks 中的任务，直到处理完成
      while (tasks.length) {
        const task = tasks.pop();
        const iterator = func(recursor, ...task);
        next(iterator);
      }

      // 处理 iterators 中的任务
      // 直到 tasks 中出现新任务，优先执行 tasks
      // 直到 iterators 执行完毕，返回结果
      while (!tasks.length && iterators.length) {
        const iterator = iterators.pop();
        if (!iterator) break;
        const preResult = results.pop();
        next(iterator, preResult);
      }
    }

    return results.pop();
  };
}

module.exports = recurToIter;
