export function htmlEscape(str: string): string {
  return str
    .replaceAll('"', '&quot;')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll(' ', '&nbsp;');
}

const escapeChars = {
  quot: '"',
  amp: '&',
  lt: '<',
  gt: '>',
  nbsp: ' ',
};

const escapedCharReg = /&(\w+);/img;

export function htmlUnescape(str: string): string {
  return str.replace(escapedCharReg, (subStr, arg) => escapeChars[arg] || subStr);
}
