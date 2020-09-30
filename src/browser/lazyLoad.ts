/**
 * @module dom
 */

/* eslint-env browser */
import { isElementInView } from './utils';
import { debounce } from '../function';

interface lazyLoadOptions {
  debounceTime?: number;
  getSrc?: (image: HTMLImageElement) => string
}

/**
 * @static
 * @summary 添加懒加载的监听方法
 * @param {Object} options 选项
 * @param {Number} options.debounceTime 防抖时间
 * @param {Function} opions.getSrc 获取真实 src 的方法，接受 image 元素作为参数，默认为获取 image.dataset.src
 * @return {Function} 取消监听的函数
 */
export default function lazyLoad(options: lazyLoadOptions = {}): () => void {
  const {
    debounceTime = 1000,
    getSrc = (image) => image.dataset.src,
  } = options;

  // 判断元素是否无需懒加载或者已经懒加载
  const canLoad = (image: HTMLImageElement): boolean => {
    const src = getSrc(image);
    if (!src) return false;
    return src !== image.src;
  };

  // 加载元素
  const load = (image: HTMLImageElement): void => {
    image.src = getSrc(image);
  };

  // 激活懒加载扫描
  const activate = () => {
    const [...images] = document.getElementsByTagName('img');
    images.filter(canLoad).filter((image) => isElementInView(image)).forEach(load);
  };

  // 防抖
  const onscroll = debounce(activate, debounceTime);
  // 初次渲染
  onscroll();
  // 监听滚动并返回取消监听函数
  window.addEventListener('scroll', onscroll, true);
  return () => window.removeEventListener('scroll', onscroll, true);
}
