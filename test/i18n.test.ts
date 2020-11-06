import assert from 'power-assert';
import { getClosestLang } from '../src/i18n'

const langs = [
  'zh-Hant-TW',
  'zh-Hant',
  'zh-Hans'
]

describe('i18n', () => {
  describe('getClosestLang', () => {
    it('准确匹配', () => {
      assert(getClosestLang('zh-Hant', langs) === 'zh-Hant')
    });

    it('模糊匹配', () => {
      assert(getClosestLang('zh', langs) === 'zh-Hant-TW')
    })

    it('兜底语言', () => {
      assert(getClosestLang('en', langs, 'zh') === 'zh-Hant-TW')
    })
  });
});
