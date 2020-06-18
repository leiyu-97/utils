/**
 * @module dom
 */

/* eslint-env browser */
const { isParentOf, isElementInView } = require('./utils');
const { debounce } = require('../function');

/**
 * @static
 * @summary 添加懒加载的监听方法
 * @param {Object} options 选项
 * @param {Number} options.debounceTime 防抖时间
 * @param {Function} opions.getSrc 获取真实 src 的方法，接受 image 元素作为参数，默认为获取 image.dataset.src
 * @return {Function} 取消监听的函数
 */
function lazyLoad(options = {}) {
  const { filter } = Array.prototype;
  const { debounceTime = 1000, getSrc = (image) => image.dataset.src } = options;

  const handler = (event) => {
    const images = document.getElementsByTagName('img');
    let imagesToLoad = filter
      .call(images, (image) => {
        const src = getSrc(image);
        if (!src) return false;
        return src !== image.src;
      });

    if (event) {
      imagesToLoad = imagesToLoad.filter(isParentOf.bind(null, event.target));
    }

    imagesToLoad
      .filter(isElementInView)
      .forEach((image) => { image.src = image.dataset.src; });
  };

  const debouncedHandler = debounce(handler, debounceTime);
  debouncedHandler();
  window.addEventListener('scroll', debouncedHandler, true);

  return () => window.removeEventListener('scroll', debouncedHandler, true);
}

module.exports = lazyLoad;
