const assert = require('assert');
const { memorize, recurToIter } = require('../src/function');

describe('function', () => {
  describe('memorize', () => {
    it('可以正常缓存', () => {
      let counter = 0;
      const sum = memorize((a, b) => {
        counter++;
        return a + b;
      });

      sum(1, 2);
      sum(2, 1);
      sum(1, 2);
      sum(1, 2);
      assert(counter === 2);
    });

    it('自定义 getKey 方法', () => {
      let counter = 0;
      const sum = memorize((a, b) => {
        counter++;
        return a + b;
      }, { getKey: (a, b) => JSON.stringify(a > b ? [a, b] : [b, a]) });

      sum(1, 2);
      sum(2, 1);
      sum(1, 2);
      sum(1, 2);
      assert(counter === 1);
    });
  });

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
