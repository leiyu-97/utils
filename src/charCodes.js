/**
 * @module charCodes
 * 区间均为左闭右开
 */

const controlCode = [0x0000, 0x009f + 1]; // 控制代码
const symbol = [
  [0x0030, 0x0039 + 1],
  [0x003a, 0x0040 + 1],
  [0x005b, 0x0060 + 1],
  [0x007b, 0x00bf + 1],
]; // 常用符号

const number = [0x0030, 0x0039 + 1]; // 数字
const uppercase = [0x0041, 0x005a + 1]; // 英文大写字母
const lowercase = [0x0061, 0x007a + 1]; // 英文小写字母
const verticalForm = [0xfe10, 0xfe19 + 1]; // 竖排符号
const fullwidthForm = [
  [0xff01, 0xff60 + 1],
  [0xffe0, 0xffe8 + 1],
]; // 全角符号及英文字母

const ChineseRadical = [
  [0x2f00, 0x2fdf + 1],
  [0x2e80, 0x2eff + 1],
]; // 中文部首
const ChineseStroke = [0x31c0, 0x31ef + 1]; // 中文笔画
const Chinese = [
  [0x4e00, 0x9fff + 1],
  [0x3400, 0x4dbf + 1],
  [0x20000, 0x2a6df + 1],
  [0x2a700, 0x2b73f + 1],
  [0x2b740, 0x2b81f + 1],
  [0x2b820, 0x2ceaf + 1],
  [0xf900, 0xfaff + 1],
  [0x2f800, 0x2fa1f + 1],
  ChineseRadical,
  ChineseStroke,
]; // 中文汉字

const JapaneseKanji = [0x4e00, 0x9fbf + 1]; // 日语汉字
const JapaneseHiragana = [0x3040, 0x309f + 1]; // 日语平假名
const JapaneseKatakana = [0x30a0, 0x31ff + 1]; // 日语片假名
const JapaneseHalfwidthKatakana = [0xff65, 0xff9f + 1]; // 日语半角片假名
const Japanese = [
  JapaneseKanji,
  JapaneseHiragana,
  JapaneseKatakana,
  JapaneseHalfwidthKatakana,
]; // 日语

const Korean = [
  [0xac00, 0xd7af + 1],
  [0x1100, 0x11ff + 1],
  [0x3130, 0x318f + 1],
  [0xa960, 0xa97f + 1],
  [0xd7b0, 0xd7ff + 1],
]; // 韩语谚文

const Hindi = [
  [0x900, 0x097f + 1],
  [0xa8e0, 0xa8ff + 1],
  [0x1cd0, 0x1cff + 1],
]; // 印地语天城文

const dingbat = [0x2700, 0x27bf + 1]; // 杂锦字型
const miscellaneousSymbol = [
  [0x1f300, 0x1f5ff + 1],
  [0x2600, 0x26ff + 1],
]; // 杂项符号
const supplementalSymbol = [0x1f900, 0x1f9ff + 1]; // 补充符号
const emoticon = [0x1f600, 0x1f64f + 1]; // 表情符号
const transport = [0x1f680, 0x1f6ff + 1]; // 交通符号
const emoji = [
  dingbat,
  miscellaneousSymbol,
  supplementalSymbol,
  emoticon,
  transport,
]; // emoji

const fullwidth = [
  verticalForm,
  fullwidthForm,
  Chinese,
  JapaneseKanji,
  JapaneseHiragana,
  JapaneseKatakana,
  Korean,
  Hindi,
  emoji,
]; // 全角字符

module.exports = {
  controlCode,
  symbol,
  number,
  uppercase,
  lowercase,
  verticalForm,
  fullwidthForm,
  ChineseRadical,
  ChineseStroke,
  Chinese,
  JapaneseKanji,
  JapaneseHiragana,
  JapaneseKatakana,
  JapaneseHalfwidthKatakana,
  Japanese,
  Korean,
  Hindi,
  dingbat,
  miscellaneousSymbol,
  supplementalSymbol,
  emoticon,
  transport,
  emoji,
  fullwidth,
};
