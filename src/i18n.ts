function matchLang(target: string, langs: string[] = []): string | null {
  const parts = target.toLowerCase().split('-');
  // xx-Xx-Xx => [xx-xx-xx, xx-xx, xx]
  for (let i = 1; i <= parts.length; i++) {
    const curTarget = parts.slice(0, i).join('-');
    const result = langs.find((lang) => lang.toLowerCase().startsWith(curTarget));
    if (result) return result;
  }

  return null;
}

/**
 * 从一组语言列表中取出与某个语言最接近的语言
 * @param target 目标语言
 * @param fallbackLang 兜底语言
 * @param langs 支持的语言列表
 */
export function getClosestLang(target: string, langs: string[] = [], fallbackLang?: string): string {
  if (langs.includes(target)) return target;
  const targetResult = matchLang(target, langs);
  if (targetResult) return targetResult;
  if (!fallbackLang) return null;
  const fallbackResult = matchLang(fallbackLang, langs);
  if (fallbackResult) return fallbackResult;
  return null;
}
