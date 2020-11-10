const assert = require('power-assert');
const { recurToIter } = require('../../../src/common/function');

describe('function', () => {
  describe('recursiveToIteration', () => {
    it('原函数正常', () => {
      function* accumulateInner(recursor, i) {
        if (!i) {
          return 0;
        }
        const preResult = yield recursor(i - 1);
        return i + preResult;
      }
      const accumulate = recurToIter(accumulateInner);

      assert(accumulate(4) === 10);
    });

    it('减少了调用栈', () => {
      const temp = Error.stackTraceLimit;
      Error.stackTraceLimit = Infinity;

      function* accumulateInner(recursor, i) {
        if (!i) {
          const error = new Error();
          assert(error.stack.split('\n').length < 100);
          return 0;
        }
        const preResult = yield recursor(i - 1);
        return i + preResult;
      }
      const accumulate = recurToIter(accumulateInner);

      accumulate(1000);
      Error.stackTraceLimit = temp;
    });

    it('多次 yield 的情况', () => {
      function* sumArrayInner(recursor, arr) {
        if (typeof arr === 'number') {
          return arr;
        }

        const a = yield recursor(arr[0]);
        const b = yield recursor(arr[1]);

        return a + b * 2;
      }

      const sumArray = recurToIter(sumArrayInner);

      assert(sumArray([[[1, 2], [1, 1]], [1, 1]]) === 17);
    });

    it('存在无效的 yield 的情况', () => {
      function* sumArrayInner(recursor, arr) {
        if (typeof arr === 'number') {
          return arr;
        }

        const foo = yield 'bar';
        assert(foo === 'bar');

        const a = yield recursor(arr[0]);
        const b = yield recursor(arr[1]);

        return a + b * 2;
      }

      const sumArray = recurToIter(sumArrayInner);

      assert(sumArray([[[1, 2], [1, 1]], [1, 1]]) === 17);
    });

    it('存在非 yield recursor 调用的情况', () => {
      let result = 0;
      /* eslint-disable */
      function* sumArrayInner(recursor, arr) {
        if (typeof arr === 'number') {
          result += arr;
          return arr;
        }

        const a = yield recursor(arr[0]);
        recursor(arr[1]);
        return a;
      }
      /* eslint-enable */

      const sumArray = recurToIter(sumArrayInner);
      assert(sumArray([[[2, 1], [1, 1]], [1, 1]]) === 2);
      assert(result === 7);
    });

    it('不定次 yield 的情况', () => {
      function* sumArrayInner(recursor, arr) {
        if (typeof arr === 'number') {
          return arr;
        }

        let result = 0;

        for (let index = 0; index < arr.length; index++) {
          result += yield recursor(arr[index]);
        }

        return result;
      }

      const sumArray = recurToIter(sumArrayInner);

      assert(sumArray([[1, 2], [1, 1], [1, 1]]) === 7);
    });
  });
});
