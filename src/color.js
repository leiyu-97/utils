/**
 * @module color
 */
const { objectToRegExp, exact } = require('./regexp');

const { raw } = String;

/**
 * @summary HTML 命名颜色
 * @type Obejct
 */
const namedColors = {
  INDIANRED: [205, 92, 92],
  LIGHTCORAL: [240, 128, 128],
  SALMON: [250, 128, 114],
  DARKSALMON: [233, 150, 122],
  LIGHTSALMON: [255, 160, 122],
  CRIMSON: [220, 20, 60],
  RED: [255, 0, 0],
  FIREBRICK: [178, 34, 34],
  DARKRED: [139, 0, 0],
  PINK: [255, 192, 203],
  LIGHTPINK: [255, 182, 193],
  HOTPINK: [255, 105, 180],
  DEEPPINK: [255, 20, 147],
  MEDIUMVIOLETRED: [199, 21, 133],
  PALEVIOLETRED: [219, 112, 147],
  CORAL: [255, 127, 80],
  TOMATO: [255, 99, 71],
  ORANGERED: [255, 69, 0],
  DARKORANGE: [255, 140, 0],
  ORANGE: [255, 165, 0],
  GOLD: [255, 215, 0],
  YELLOW: [255, 255, 0],
  LIGHTYELLOW: [255, 255, 224],
  LEMONCHIFFON: [255, 250, 205],
  LIGHTGOLDENRODYELLOW: [250, 250, 210],
  PAPAYAWHIP: [255, 239, 213],
  MOCCASIN: [255, 228, 181],
  PEACHPUFF: [255, 218, 185],
  PALEGOLDENROD: [238, 232, 170],
  KHAKI: [240, 230, 140],
  DARKKHAKI: [189, 183, 107],
  LAVENDER: [230, 230, 250],
  THISTLE: [216, 191, 216],
  PLUM: [221, 160, 221],
  VIOLET: [238, 130, 238],
  ORCHID: [218, 112, 214],
  FUCHSIA: [255, 0, 255],
  MAGENTA: [255, 0, 255],
  MEDIUMORCHID: [186, 85, 211],
  MEDIUMPURPLE: [147, 112, 219],
  REBECCAPURPLE: [102, 51, 153],
  BLUEVIOLET: [138, 43, 226],
  DARKVIOLET: [148, 0, 211],
  DARKORCHID: [153, 50, 204],
  DARKMAGENTA: [139, 0, 139],
  PURPLE: [128, 0, 128],
  INDIGO: [75, 0, 130],
  SLATEBLUE: [106, 90, 205],
  DARKSLATEBLUE: [72, 61, 139],
  MEDIUMSLATEBLUE: [123, 104, 238],
  GREENYELLOW: [173, 255, 47],
  CHARTREUSE: [127, 255, 0],
  LAWNGREEN: [124, 252, 0],
  LIME: [0, 255, 0],
  LIMEGREEN: [50, 205, 50],
  PALEGREEN: [152, 251, 152],
  LIGHTGREEN: [144, 238, 144],
  MEDIUMSPRINGGREEN: [0, 250, 154],
  SPRINGGREEN: [0, 255, 127],
  MEDIUMSEAGREEN: [60, 179, 113],
  SEAGREEN: [46, 139, 87],
  FORESTGREEN: [34, 139, 34],
  GREEN: [0, 128, 0],
  DARKGREEN: [0, 100, 0],
  YELLOWGREEN: [154, 205, 50],
  OLIVEDRAB: [107, 142, 35],
  OLIVE: [128, 128, 0],
  DARKOLIVEGREEN: [85, 107, 47],
  MEDIUMAQUAMARINE: [102, 205, 170],
  DARKSEAGREEN: [143, 188, 139],
  LIGHTSEAGREEN: [32, 178, 170],
  DARKCYAN: [0, 139, 139],
  TEAL: [0, 128, 128],
  AQUA: [0, 255, 255],
  CYAN: [0, 255, 255],
  LIGHTCYAN: [224, 255, 255],
  PALETURQUOISE: [175, 238, 238],
  AQUAMARINE: [127, 255, 212],
  TURQUOISE: [64, 224, 208],
  MEDIUMTURQUOISE: [72, 209, 204],
  DARKTURQUOISE: [0, 206, 209],
  CADETBLUE: [95, 158, 160],
  STEELBLUE: [70, 130, 180],
  LIGHTSTEELBLUE: [176, 196, 222],
  POWDERBLUE: [176, 224, 230],
  LIGHTBLUE: [173, 216, 230],
  SKYBLUE: [135, 206, 235],
  LIGHTSKYBLUE: [135, 206, 250],
  DEEPSKYBLUE: [0, 191, 255],
  DODGERBLUE: [30, 144, 255],
  CORNFLOWERBLUE: [100, 149, 237],
  ROYALBLUE: [65, 105, 225],
  BLUE: [0, 0, 255],
  MEDIUMBLUE: [0, 0, 205],
  DARKBLUE: [0, 0, 139],
  NAVY: [0, 0, 128],
  MIDNIGHTBLUE: [25, 25, 112],
  CORNSILK: [255, 248, 220],
  BLANCHEDALMOND: [255, 235, 205],
  BISQUE: [255, 228, 196],
  NAVAJOWHITE: [255, 222, 173],
  WHEAT: [245, 222, 179],
  BURLYWOOD: [222, 184, 135],
  TAN: [210, 180, 140],
  ROSYBROWN: [188, 143, 143],
  SANDYBROWN: [244, 164, 96],
  GOLDENROD: [218, 165, 32],
  DARKGOLDENROD: [184, 134, 11],
  PERU: [205, 133, 63],
  CHOCOLATE: [210, 105, 30],
  SADDLEBROWN: [139, 69, 19],
  SIENNA: [160, 82, 45],
  BROWN: [165, 42, 42],
  MAROON: [128, 0, 0],
  WHITE: [255, 255, 255],
  SNOW: [255, 250, 250],
  HONEYDEW: [240, 255, 240],
  MINTCREAM: [245, 255, 250],
  AZURE: [240, 255, 255],
  ALICEBLUE: [240, 248, 255],
  GHOSTWHITE: [248, 248, 255],
  WHITESMOKE: [245, 245, 245],
  SEASHELL: [255, 245, 238],
  BEIGE: [245, 245, 220],
  OLDLACE: [253, 245, 230],
  FLORALWHITE: [255, 250, 240],
  IVORY: [255, 255, 240],
  ANTIQUEWHITE: [250, 235, 215],
  LINEN: [250, 240, 230],
  LAVENDERBLUSH: [255, 240, 245],
  MISTYROSE: [255, 228, 225],
  GAINSBORO: [220, 220, 220],
  LIGHTGRAY: [211, 211, 211],
  SILVER: [192, 192, 192],
  DARKGRAY: [169, 169, 169],
  GRAY: [128, 128, 128],
  DIMGRAY: [105, 105, 105],
  LIGHTSLATEGRAY: [119, 136, 153],
  SLATEGRAY: [112, 128, 144],
  DARKSLATEGRAY: [47, 79, 79],
  BLACK: [0, 0, 0],
};

const colorExp = {
  b: raw`\s*`,
  color: raw`(\d+)`,
  e: raw`\s*`,
};
const hexExp = raw`[0-9A-F]`;
const rgbExp = {
  b: raw`rgb\(`,
  wRed: colorExp, // $1，红色值
  comma1: ',',
  wGreen: colorExp, // $2，绿色值
  comma2: ',',
  wBlue: colorExp, // $3， 蓝色值
  e: raw`\)`,
};
const rgbaExp = {
  b: raw`rgba\(`,
  wRed: colorExp, // $1，红色值
  comma1: ',',
  wGreen: colorExp, // $2，绿色值
  comma2: ',',
  wBlue: colorExp, // $3，蓝色值
  comma3: ',',
  wOpacity: {
    b: raw`\s*`,
    opacity: raw`([0-9.]+)`, // $4，不透明度
    e: raw`\s*`,
  },
  e: raw`\)`,
};
const hexColorExp = {
  b: raw`#(`,
  value: hexExp,
  e: raw`{3,8})`,
};

const rgbRegExp = objectToRegExp(exact(rgbExp), 'i');
const rgbaRegExp = objectToRegExp(exact(rgbaExp), 'i');
const hexColorRegExp = objectToRegExp(exact(hexColorExp), 'i');

/**
 * @static
 * @summary 解析颜色字符串
 * @param {String} color 颜色字符串
 * @return {Object} data
 * @return {Number} data.red 红色值
 * @return {Number} data.green 绿色值
 * @return {Number} data.blue 蓝色值
 * @return {Number} data.alpha 不透明度
 */
function parseColor(color) {
  // 处理 "rgb(255, 255, 255)"
  const rgb = color.match(rgbRegExp);
  if (rgb) {
    const [, r, g, b] = rgb;
    return {
      red: parseFloat(r),
      green: parseFloat(g),
      blue: parseFloat(b),
      alpha: 1,
    };
  }

  // 处理 "rgba(255, 255, 255, 1)"
  const rgba = color.match(rgbaRegExp);
  if (rgba) {
    const [, r, g, b, a] = rgba;
    return {
      red: parseFloat(r),
      green: parseFloat(g),
      blue: parseFloat(b),
      alpha: parseFloat(a),
    };
  }

  // 处理 "#FFFFFF"
  const hex = color.match(hexColorRegExp);
  if (hex) {
    const [, value] = hex;
    let r;
    let g;
    let b;
    let a;
    switch (value.length) {
      case 3:
        [r, g, b] = value;
        return {
          red: parseInt(`${r}${r}`, 16),
          green: parseInt(`${g}${g}`, 16),
          blue: parseInt(`${b}${b}`, 16),
          alpha: 1,
        };
      case 4:
        [r, g, b, a] = value;
        return {
          red: parseInt(`${r}${r}`, 16),
          green: parseInt(`${g}${g}`, 16),
          blue: parseInt(`${b}${b}`, 16),
          alpha: parseInt(`${a}${a}`, 16) / 255,
        };
      case 6:
        r = value.slice(0, 2);
        g = value.slice(2, 4);
        b = value.slice(4, 6);
        return {
          red: parseInt(r, 16),
          green: parseInt(g, 16),
          blue: parseInt(b, 16),
          alpha: 1,
        };
      case 8:
        r = value.slice(0, 2);
        g = value.slice(2, 4);
        b = value.slice(4, 6);
        a = value.slice(6, 8);
        return {
          red: parseInt(r, 16),
          green: parseInt(g, 16),
          blue: parseInt(b, 16),
          alpha: parseInt(a, 16) / 255,
        };
      default:
        break;
    }
  }

  // 处理 "white"
  const namedColor = namedColors[color.toUpperCase()];
  if (namedColor) {
    const [r, g, b] = namedColor;
    return {
      red: r,
      green: g,
      blue: b,
      alpha: 1,
    };
  }

  throw new Error(`非法的颜色值: ${color}`);
}

/**
 * @summary rgb 转 16进制 没啥错误处理的
 * @param {Number} r // 0-255
 * @param {Number} g // 0-255
 * @param {Number} b // 0-255
 * @return {String} 十六进制颜色代码
 */
function RGBToHex(r, g, b) {
  return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
}

module.exports = {
  parseColor,
  namedColors,
  RGBToHex,
};
