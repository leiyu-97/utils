const { objectToRegExp } = require("./regexp");
const { raw } = String;

const colorExp = {
  b: raw`\s*`,
  color: raw`(\d+)`,
  e: raw`\s*`,
};
const hexExp = raw`[0-9A-F]`;
const rgbExp = {
  b: raw`rgb\(`,
  wRed: colorExp,
  comma1: ",",
  wGreen: colorExp,
  comma2: ",",
  wBlue: colorExp,
  e: raw`\)`,
};
const rgbaExp = {
  b: raw`rgba\(`,
  wRed: colorExp,
  comma1: ",",
  wGreen: colorExp,
  comma2: ",",
  wBlue: colorExp,
  comma3: ",",
  wOpacity: {
    b: raw`\s*`,
    opacity: raw`([0-9.]+)`,
    e: raw`\s*`,
  },
  e: raw`\)`,
};
const hexColorExp = {
  b: raw`#`,
  wColor: {
    b: raw`(`,
    wRed: {
      b: raw`(`
      red: {
        1: hexExp,
        2: hexExp
      }
      e: raw`)`
    },
    wGreen: {
      b: raw`(`
      green: {
        1: hexExp,
        2: hexExp
      }
      e: raw`)`
    }
    wBlue: {
      b: raw`(`
      blue: {
        1: hexExp,
        2: hexExp
      }
      e: raw`)`
    },
    oOpacity: {
      b: raw`(`,
      opacity: {
        1: hexExp,
        2: hexExp
      }
      e: raw`)?`,
    },
    e: raw`)`,
  },
};

const rgbRegExp = new RegExp(objectValuesToString(rgbExp), "ig");
const rgbaRegExp = new RegExp(objectValuesToString(rgbaExp), "ig");
const hexRegExp = new RegExp(objectValuesToString(hexColorExp), "ig");

module.exports = {
  rgbRegExp,
  rgbaRegExp,
  hexRegExp,
  rgbExp,
  rgbaExp,
  hexExp,
};
