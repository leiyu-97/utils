const assert = require('assert');
const {
  paging, shallowEqual, sort, classify,
} = require('../src/array');

describe('array', () => {
  describe('paging', () => {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    it('分页结果正确', () => {
      assert(paging(data, 0, 3)[0] === 0);
      assert(paging(data, 1, 3)[1] === 4);
      assert(paging(data, 2, 3)[2] === 8);
    });
  });

  describe('sort', () => {
    const data = [0, 9, 7, 2, 3, 5, 4, 1, 6, 8];
    const ascData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const descData = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

    it('顺序排序结果正确', () => {
      shallowEqual(sort(data), ascData);
    });

    it('倒序排序结果正确', () => {
      shallowEqual(sort(data), descData);
    });

    it('原数组不被修改', () => {
      sort(data);
      assert(shallowEqual(data, [0, 9, 7, 2, 3, 5, 4, 1, 6, 8]));
    });

    it('根据 identity 排序', () => {
      const objArray = data.map((i) => ({ value: i }));
      const sortedArray = sort(objArray, 'asc', 'value');
      assert(sortedArray.every((obj, index) => obj.value === ascData[index]));
    });
  });

  describe('shallowEqual', () => {
    it('应该相等', () => {
      assert(shallowEqual([1, 2, 3], [1, 2, 3]));
    });

    it('不应该相等', () => {
      assert(!shallowEqual([1, 2, 3], [3, 2, 1]));
      assert(!shallowEqual([{}], [{}]));
    });
  });

  describe('classify', () => {
    const data = [
      { gender: 'male', age: 11 },
      { gender: 'female', age: 12 },
      { gender: 'female', age: 13 },
      { gender: 'male', age: 14 },
      { gender: 'male', age: 15 },
      { gender: 'female', age: 16 },
      { gender: 'female', age: 17 },
      { gender: 'male', age: 18 },
      { gender: 'female', age: 19 },
      { gender: 'apache helicopter', age: 20 },
    ];


    it('单分类条件', () => {
      const result = classify(data, 'gender');
      assert(result.length === 3);
      assert(result.find(({ keys: [gender] }) => gender === 'male').items.length === 4);
    });

    it('函数分类条件', () => {
      const result = classify(data, ({ age }) => (age < 18 ? 'minor' : 'major'));
      assert(result.length === 2);
      assert(result.find(({ keys: [age] }) => age === 'major').items.length === 3);
    });

    it('多分类条件', () => {
      const result = classify(data, ['gender', ({ age }) => (age < 18 ? 'minor' : 'major')]);
      assert(result.length === 5);
    });
  });
});
