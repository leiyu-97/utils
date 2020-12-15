/**
 * @module dom
 */

/* eslint-env browser */
/* eslint-disable no-use-before-define */
if (!document) throw new Error('该文件只能在浏览器环境中使用');

const DOCUMENT_POSITION_CONTAINS = 8;
const DOCUMENT_POSITION_CONTAINED_BY = 16;

/**
 * 判断元素是否为另一元素的子元素
 * @param {HTMLElement} child 子元素
 * @param {HTMLElement} parent 父元素
 * @return {Boolean} child 是否为 parent 的子元素
 */
export function isChildOf(child: HTMLElement, parent: HTMLElement): boolean {
  return !!(child.compareDocumentPosition(parent) & DOCUMENT_POSITION_CONTAINS);
}

/**
 * 判断元素是否为另一元素的父元素
 * @param {HTMLElement} parent 父元素
 * @param {HTMLElement} child 子元素
 * @return {Boolean} parent 是否为 child 的父元素
 */
export function isParentOf(parent: HTMLElement, child: HTMLElement): boolean {
  return !!(
    parent.compareDocumentPosition(child) & DOCUMENT_POSITION_CONTAINED_BY
  );
}

/**
 * 获取元素的总 scrollTop
 * @param {HTMLElement} ele 元素
 * @param {HTMLElement} endpoint 终点
 * @return {Number} scrollTop
 */
export function getScrollTop(
  ele: HTMLElement,
  endpoint: HTMLElement = document.documentElement,
): number {
  if (!ele) return 0;
  const parent = ele.parentElement;
  if (parent === endpoint) return parent.scrollTop;
  return parent.scrollTop + getScrollTop(parent, endpoint);
}

/**
 * 获取元素的总 scrollLeft
 * @param {HTMLElement} ele 元素
 * @param {HTMLElement} endpoint 终点
 * @return {Number} scrollLeft
 */
export function getScrollLeft(
  ele: HTMLElement,
  endpoint: HTMLElement = document.documentElement,
): number {
  if (!ele) return 0;
  const parent = ele.parentElement;
  if (parent === endpoint) return parent.scrollLeft;
  return parent.scrollLeft + getScrollLeft(parent, endpoint);
}

/**
 * 获取多个元素最低的共同父元素
 * @param  {...HTMLElement} eles 元素
 * @return {HTMLElement} 最低共同父元素
 */
export function getCommonParent(...eles: HTMLElement[]): HTMLElement | null {
  const [ele, ...others] = eles;
  let parent = ele;
  const isChildOfParent = (child: HTMLElement) => isChildOf(child, parent);
  while (parent) {
    if (others.every(isChildOfParent)) return parent;
    parent = ele.parentElement;
  }
  return null;
}

/**
 * 获取元素的相对于另一元素的 offsetTop
 * @param {HTMLElement} a 元素 a
 * @param {HTMLElement} b 元素 b
 * @return {Number} offsetTop
 */
export function getOffsetTop(
  a: HTMLElement,
  b: HTMLElement = document.body,
): number {
  if (isChildOf(a, b)) return getOffsetTopOfParent(a, b);
  if (isChildOf(b, a)) return getOffsetTopOfParent(b, a);
  const parent = getCommonParent(a, b);
  return getOffsetTopOfParent(a, parent) - getOffsetTopOfParent(b, parent);
}

/** 获取元素相对一父元素的 offsetTop */
function getOffsetTopOfParent(ele: HTMLElement, parent: HTMLElement) {
  if (ele.offsetParent === parent) return ele.offsetTop;
  if (ele.offsetParent === parent.offsetParent) return ele.offsetTop - parent.offsetTop;
  return ele.offsetTop + getOffsetTop(ele.offsetParent as HTMLElement, parent);
}

/**
 * 获取元素的相对于另一元素的 offsetLeft
 * @param {HTMLElement} a 元素 a
 * @param {HTMLElement} b 元素 b
 * @return {Number} offsetLeft
 */
export function getOffsetLeft(
  a: HTMLElement,
  b: HTMLElement = document.body,
): number {
  if (isChildOf(a, b)) return getOffsetLeftOfParent(a, b);
  if (isChildOf(b, a)) return getOffsetLeftOfParent(b, a);
  const parent = getCommonParent(a, b);
  return getOffsetLeftOfParent(a, parent) - getOffsetLeftOfParent(b, parent);
}

/** 获取元素相对一父元素的 offsetLeft */
function getOffsetLeftOfParent(ele: HTMLElement, parent: HTMLElement) {
  if (ele.offsetParent === parent) return ele.offsetLeft;
  if (ele.offsetParent === parent.offsetParent) return ele.offsetLeft - parent.offsetLeft;
  return ele.offsetLeft + getOffsetLeft(ele.offsetParent as HTMLElement, parent);
}

/**
 * 获取元素的第一个可滚动父元素
 * @param {HTMLElement} ele 元素
 * @return {HTMLElement|Null} 第一个可滚动父元素
 */
export function getScrollParent(ele: HTMLElement): HTMLElement | null {
  if (!ele) return null;
  const parent = ele.parentElement;
  if (!parent) return null;
  if (parent.scrollHeight > parent.clientHeight) return parent;
  return getScrollParent(parent);
}

/**
 * 判断元素是否在视口内
 * @param {HTMLElement} ele 元素
 * @param {HTMLElement} endpoint 终点
 * @return {Boolean} 元素是否在视口内
 */
export function isElementInView(
  ele: HTMLElement,
  endpoint: HTMLElement = document.documentElement,
): boolean {
  const { offsetHeight, offsetWidth } = ele;
  let parent = ele;

  while (true) {
    // 向上寻找第一个可滚动元素
    parent = getScrollParent(parent);
    if (!parent || isParentOf(parent, endpoint)) return true;

    const { offsetHeight: clientHeight, offsetWidth: clientWidth } = parent;

    // 判断纵向是否在该元素视口内
    const clientTopMin = getScrollTop(ele, parent);
    const clientTopMax = clientTopMin + clientHeight;
    const eleTopMin = getOffsetTop(ele, parent);
    const eleTopMax = eleTopMin + offsetHeight;
    const isHeightInView = eleTopMax > clientTopMin && eleTopMin < clientTopMax;
    if (!isHeightInView) return false;

    // 判断横向是否在该元素视口内
    const clientLeftMin = getScrollLeft(ele, parent);
    const clientLeftMax = clientLeftMin + clientWidth;
    const eleLeftMin = getOffsetLeft(ele, parent);
    const eleLeftMax = eleLeftMin + offsetWidth;
    const isWidthInView = eleLeftMax > clientLeftMin && eleLeftMin < clientLeftMax;
    if (!isWidthInView) return false;
  }
}
