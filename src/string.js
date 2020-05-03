const base = require('./base');

const repeat = (str, times) => {
  let result = '';
  base.repeat(() => { result += str; }, times);
  return result;
};

module.exports = {
  repeat,
};
