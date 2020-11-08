const assert = require('assert');
const { parseColor, RGBToHex } = require('../../src/common/color');
const { shallowEqual } = require('../../src/common/object');

describe('color', () => {
  describe('parseColor', () => {
    it('rgb颜色', () => {
      assert(
        shallowEqual(parseColor('rgb(255, 255,255 )'), {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 1,
        }),
      );

      assert(
        shallowEqual(parseColor('RGB(245, 245, 220)'), {
          red: 245,
          green: 245,
          blue: 220,
          alpha: 1,
        }),
      );
    });


    it('rgba颜色', () => {
      assert(
        shallowEqual(parseColor('rgba(255, 255,255 , 0 )'), {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 0,
        }),
      );

      assert(
        shallowEqual(parseColor('RGBA(245, 245, 220, .8)'), {
          red: 245,
          green: 245,
          blue: 220,
          alpha: 0.8,
        }),
      );
    });


    it('hex颜色', () => {
      assert(
        shallowEqual(parseColor('#FFF'), {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 1,
        }),
      );

      assert(
        shallowEqual(parseColor('#FFFE'), {
          red: 255,
          green: 255,
          blue: 255,
          alpha: 238 / 255,
        }),
      );

      assert(
        shallowEqual(parseColor('#FF6347'), {
          red: 255,
          green: 99,
          blue: 71,
          alpha: 1,
        }),
      );

      assert(
        shallowEqual(parseColor('#FF6347EE'), {
          red: 255,
          green: 99,
          blue: 71,
          alpha: 238 / 255,
        }),
      );
    });

    it('命名颜色', () => {
      shallowEqual(parseColor('red'), {
        red: 255,
        green: 255,
        blue: 255,
        alpha: 1,
      });

      shallowEqual(parseColor('ORCHID'), {
        red: 218,
        green: 112,
        blue: 214,
        alpha: 1,
      });
    });

    it('rgb转16进制', () => {
      assert(RGBToHex(255, 255, 255), 'ffffff')
    });
  });
});
