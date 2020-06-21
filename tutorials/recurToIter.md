## 递归方法转迭代方法

我们有如下递归方法，希望将其改为迭代方法

```javascript
function sumArray(arr) {
  if (typeof arr === 'number') {
    return arr;
  }

  let result = 0;
  for (let index = 0; index < arr.length; index++) {
    result += recursor(arr[index]);
  }
  return result;
}

console.log(sumArray([[1, 2], [1, 1], [1, 1]])); // 7
```

首先在 `function` 后加上 `*`，使之成为一个 generator 函数，
然后将 recursor 作为第一个参数，将函数内部所有调用自身的部分改为调用 recursor，并在前面加上 `yield`

```javascript
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

```

最后从 function.js 中引入 recurToIter 方法，并将原来的函数传入得到新的函数

```javascript
const sumArray = recurToIter(sumArrayInner);
console.log(sumArray([[1, 2], [1, 1], [1, 1]])); // 7
```