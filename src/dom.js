/**
 * @module dom
 */

const DOCUMENT_POSITION_CONTAINS = 8;
const DOCUMENT_POSITION_CONTAINED_BY = 16;

/**
 * @static
 * @summary 判断元素是否为另一元素的子元素
 * @param {HTMLElement} child 子元素
 * @param {HTMLElement} parent 父元素
 * @return {Boolean} child 是否为 parent 的子元素
 */
const isChildOf = (child, parent) =>
  child.compareDocumentPosition(parent) & DOCUMENT_POSITION_CONTAINS;

/**
 * @static
 * @summary 判断元素是否为另一元素的父元素
 * @param {HTMLElement} parent 父元素
 * @param {HTMLElement} child 子元素
 * @return {Boolean} parent 是否为 child 的父元素
 */
const isParentOf = (parent, child) =>
  parent.compareDocumentPosition(child) & DOCUMENT_POSITION_CONTAINED_BY;

module.exports = {
  isChildOf,
  isParentOf,
};
