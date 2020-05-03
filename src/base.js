function repeat(func, times) {
  const result = [];
  for (let index = 0; index < times; index++) {
    result.push(func());
  }
  return result;
}

module.exports = {
  repeat,
};
