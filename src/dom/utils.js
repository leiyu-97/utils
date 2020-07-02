/**
 * @module dom
 */

/* eslint-env browser */
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
  return child.compareDocumentPosition(parent) & DOCUMENT_POSITION_CONTAINS;
}

/**
 * @static
 * @summary 判断元素是否为另一元素的父元素
 * @param {HTMLElement} parent 父元素
 * @param {HTMLElement} child 子元素
 * @return {Boolean} parent 是否为 child 的父元素
 */
function isParentOf(parent, child) {
  return parent.compareDocumentPosition(child) & DOCUMENT_POSITION_CONTAINED_BY;
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
 * @summary 获取元素的总 offsetTop
 * @param {HTMLElement} ele 元素
 * @param {HTMLElement} endpoint 终点
 * @return {Number} offsetTop
 */
function getOffsetTop(ele, endpoint = document.body) {
  if (!ele) return 0;
  if (ele === endpoint) return 0;
  return ele.offsetTop + getOffsetTop(ele.offsetParent, endpoint);
}

/**
 * @static
 * @summary 获取元素的总 offsetLeft
 * @param {HTMLElement} ele 元素
 * @param {HTMLElement} endpoint 终点
 * @return {Number} offsetLeft
 */
function getOffsetLeft(ele, endpoint = document.body) {
  if (!ele) return 0;
  if (ele === endpoint) return 0;
  return ele.offsetLeft + getOffsetLeft(ele.offsetParent, endpoint);
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
 * @return {Number} offsetLeft
 */
function isElementInView(ele) {
  const { clientHeight, clientWidth } = document.documentElement;
  const { offsetHeight, offsetWidth } = ele;

  // 判断纵向是否在视口内
  const clientTopMin = getScrollTop(ele);
  const clientTopMax = clientTopMin + clientHeight;
  const eleTopMin = getOffsetTop(ele);
  const eleTopMax = eleTopMin + offsetHeight;
  const isHeightInView = eleTopMax > clientTopMin && eleTopMin < clientTopMax;
  if (!isHeightInView) return false;

  // 判断横向是否在视口内
  const clientLeftMin = getScrollLeft(ele);
  const clientLeftMax = clientLeftMin + clientWidth;
  const eleLeftMin = getOffsetLeft(ele);
  const eleLeftMax = eleLeftMin + offsetWidth;
  const isWidthInView = eleLeftMax > clientLeftMin && eleLeftMin < clientLeftMax;
  if (!isWidthInView) return false;

  // 判断父窗口是否在视口内
  const parent = getScrollParent(ele);
  if (!parent) return true;
  return isElementInView(parent);
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
};
