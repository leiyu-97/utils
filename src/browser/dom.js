/**
 * @module browser
 */
if (!document) throw new Error('该文件只能在浏览器环境中使用');

const DOCUMENT_POSITION_CONTAINS = 8;
const DOCUMENT_POSITION_CONTAINED_BY = 16;

/**
 * @static
 * @summary 判断元素是否为另一元素的子元素
 * @param {HTMLElement} child 子元素
 * @param {HTMLElement} parent 父元素
 * @return {Boolean} child 是否为 parent 的子元素
 */
function isChildOf(child, parent) {
  return !!(child.compareDocumentPosition(parent) & DOCUMENT_POSITION_CONTAINS);
}

/**
 * @static
 * @summary 判断元素是否为另一元素的父元素
 * @param {HTMLElement} parent 父元素
 * @param {HTMLElement} child 子元素
 * @return {Boolean} parent 是否为 child 的父元素
 */
function isParentOf(parent, child) {
  return !!(parent.compareDocumentPosition(child) & DOCUMENT_POSITION_CONTAINED_BY);
}

/**
 * @static
 * @summary 获取元素的总 scrollTop
 * @param {HTMLElement} ele 元素
 * @param {HTMLElement} endpoint 终点
 * @return {Number} scrollTop
 */
function getScrollTop(ele, endpoint = document.documentElement) {
  if (!ele) return 0;
  const parent = ele.parentNode;
  if (parent === endpoint) return parent.scrollTop;
  return parent.scrollTop + getScrollTop(parent, endpoint);
}

/**
 * @static
 * @summary 获取元素的总 scrollLeft
 * @param {HTMLElement} ele 元素
 * @param {HTMLElement} endpoint 终点
 * @return {Number} scrollLeft
 */
function getScrollLeft(ele, endpoint = document.documentElement) {
  if (!ele) return 0;
  const parent = ele.parentNode;
  if (parent === endpoint) return parent.scrollLeft;
  return parent.scrollLeft + getScrollLeft(parent, endpoint);
}

/**
 * @static
 * @summary 获取多个元素最低的共同父元素
 * @param  {...HTMLElement} eles 元素
 * @return {HTMLElement} 最低共同父元素
 */
function getCommonParent(...eles) {
  const [ele, ...others] = eles;
  let parent = ele;
  const isChildOfParent = (child) => isChildOf(child, parent);
  while (parent) {
    if (others.every(isChildOfParent)) return parent;
    parent = ele.parentNode;
  }
  return null;
}

/**
 * @static
 * @summary 获取元素的相对于另一元素的 offsetTop
 * @param {HTMLElement} a 元素 a
 * @param {HTMLElement} b 元素 b
 * @return {Number} offsetTop
 */
function getOffsetTop(a, b = document.body) {
  if (isChildOf(a, b)) {
    if (a.offsetParent === b) return a.offsetTop;
    if (a.offsetParent === b.offsetParent) return a.offsetTop - b.offsetTop;
    return a.offsetTop + getOffsetTop(a.offsetParent, b);
  }
  const parent = getCommonParent(b, a);
  return getOffsetTop(a, parent) - getOffsetTop(b, parent);
}

/**
 * @static
 * @summary 获取元素的相对于另一元素的 offsetLeft
 * @param {HTMLElement} a 元素 a
 * @param {HTMLElement} b 元素 b
 * @return {Number} offsetLeft
 */
function getOffsetLeft(a, b = document.body) {
  if (isChildOf(a, b)) {
    if (a.offsetParent === b) return a.offsetLeft;
    if (a.offsetParent === b.offsetParent) return a.offsetLeft - b.offsetLeft;
    return a.offsetLeft + getOffsetLeft(a.offsetParent, b);
  }
  const parent = getCommonParent(b, a);
  return getOffsetLeft(a, parent) - getOffsetLeft(b, parent);
}

/**
 * @static
 * @summary 获取元素的第一个可滚动父元素
 * @param {HTMLElement} ele 元素
 * @return {HTMLElement|Null} 第一个可滚动父元素
 */
function getScrollParent(ele) {
  if (!ele) return null;
  const parent = ele.parentNode;
  if (!parent) return null;
  if (parent.scrollHeight > parent.clientHeight) return parent;
  return getScrollParent(parent);
}

/**
 * @static
 * @summary 判断元素是否在视口内
 * @param {HTMLElement} ele 元素
 * @param {HTMLElement} endpoint 终点
 * @return {Boolean} 元素是否在视口内
 */
function isElementInView(ele, endpoint = document.documentElement) {
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

module.exports = {
  isChildOf,
  isParentOf,
  getScrollParent,
  getScrollTop,
  getOffsetTop,
  getScrollLeft,
  getOffsetLeft,
  isElementInView,
  getCommonParent,
};
