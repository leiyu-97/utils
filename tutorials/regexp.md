## 对象形式的正则表达式
编写示例
```javascript
const colorExp = {
  b: String.raw`\s*`, //
  color: String.raw`(\d+)`, // 颜色值 255
  e: String.raw`\s*`, //
};

const rgbExp = {
  b: String.raw`^rgb\(`, // 前缀 rgb(
  wRed: colorExp, // 红色值 255
  comma1: ",", // ,
  wGreen: colorExp, // 绿色值 255
  comma2: ",", // ,
  wBlue: colorExp, // 蓝色值 255
  e: String.raw`\)$`, // 后缀 )
};

const rgbRegExp = objectToRegExp(rgbExp)
```