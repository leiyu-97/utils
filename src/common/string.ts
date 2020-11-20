type MatchResult = { index?:number, groups: string[] }

function match(str: string, pattern: string | RegExp): MatchResult {
  if (pattern instanceof RegExp) {
    const result = pattern.exec(str);
    pattern.lastIndex = 0;
    if (!result) return null;
    return {
      index: result.index,
      groups: [...result],
    };
  }

  const index = str.indexOf(pattern);
  if (index === -1) return null;
  return {
    groups: [pattern],
    index,
  };
}

export function replaceWith<T>(
  str: string,
  pattern: string | RegExp,
  replacer: (...args: string[]) => T,
): (string | T)[] {
  let restStr = str;
  const result = [];

  while (true) {
    const matchResult = match(restStr, pattern);
    if (!matchResult) {
      result.push(restStr);
      break;
    }
    const { index, groups } = matchResult;
    if (index !== 0) result.push(restStr.slice(0, index));
    result.push(replacer(...groups));
    restStr = restStr.slice(index + groups[0].length);
  }

  return result;
}
