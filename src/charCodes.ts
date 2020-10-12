/**
 * 区间均为左闭右开
 * @module charCodes
 */
type CodeRange = [number, number]

export const controlCode = [0x0000, 0x009f + 1] as CodeRange; // 控制代码
export const symbol = [
  [0x0030, 0x0039 + 1] as CodeRange,
  [0x003a, 0x0040 + 1] as CodeRange,
  [0x005b, 0x0060 + 1] as CodeRange,
  [0x007b, 0x00bf + 1] as CodeRange,
]; // 常用符号

export const number = [0x0030, 0x0039 + 1] as CodeRange; // 数字
export const uppercase = [0x0041, 0x005a + 1] as CodeRange; // 英文大写字母
export const lowercase = [0x0061, 0x007a + 1] as CodeRange; // 英文小写字母
export const verticalForm = [0xfe10, 0xfe19 + 1] as CodeRange; // 竖排符号
export const fullwidthForm = [
  [0xff01, 0xff60 + 1] as CodeRange,
  [0xffe0, 0xffe8 + 1] as CodeRange,
]; // 全角符号及英文字母

export const ChineseRadical = [
  [0x2f00, 0x2fdf + 1] as CodeRange,
  [0x2e80, 0x2eff + 1] as CodeRange,
]; // 中文部首
export const ChineseStroke = [0x31c0, 0x31ef + 1] as CodeRange; // 中文笔画
export const Chinese = [
  [0x4e00, 0x9fff + 1] as CodeRange,
  [0x3400, 0x4dbf + 1] as CodeRange,
  [0x20000, 0x2a6df + 1] as CodeRange,
  [0x2a700, 0x2b73f + 1] as CodeRange,
  [0x2b740, 0x2b81f + 1] as CodeRange,
  [0x2b820, 0x2ceaf + 1] as CodeRange,
  [0xf900, 0xfaff + 1] as CodeRange,
  [0x2f800, 0x2fa1f + 1] as CodeRange,
  ChineseRadical,
  ChineseStroke,
]; // 中文汉字

export const JapaneseKanji = [0x4e00, 0x9fbf + 1] as CodeRange; // 日语汉字
export const JapaneseHiragana = [0x3040, 0x309f + 1] as CodeRange; // 日语平假名
export const JapaneseKatakana = [0x30a0, 0x31ff + 1] as CodeRange; // 日语片假名
export const JapaneseHalfwidthKatakana = [0xff65, 0xff9f + 1] as CodeRange; // 日语半角片假名
export const Japanese = [
  JapaneseKanji,
  JapaneseHiragana,
  JapaneseKatakana,
  JapaneseHalfwidthKatakana,
]; // 日语

export const Korean = [
  [0xac00, 0xd7af + 1] as CodeRange,
  [0x1100, 0x11ff + 1] as CodeRange,
  [0x3130, 0x318f + 1] as CodeRange,
  [0xa960, 0xa97f + 1] as CodeRange,
  [0xd7b0, 0xd7ff + 1] as CodeRange,
]; // 韩语谚文

export const Hindi = [
  [0x900, 0x097f + 1] as CodeRange,
  [0xa8e0, 0xa8ff + 1] as CodeRange,
  [0x1cd0, 0x1cff + 1] as CodeRange,
]; // 印地语天城文

export const dingbat = [0x2700, 0x27bf + 1] as CodeRange; // 杂锦字型
export const miscellaneousSymbol = [
  [0x1f300, 0x1f5ff + 1] as CodeRange,
  [0x2600, 0x26ff + 1] as CodeRange,
]; // 杂项符号
export const supplementalSymbol = [0x1f900, 0x1f9ff + 1] as CodeRange; // 补充符号
export const emoticon = [0x1f600, 0x1f64f + 1] as CodeRange; // 表情符号
export const transport = [0x1f680, 0x1f6ff + 1] as CodeRange; // 交通符号
export const emoji = [
  dingbat,
  miscellaneousSymbol,
  supplementalSymbol,
  emoticon,
  transport,
]; // emoji

export const fullwidth = [
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
