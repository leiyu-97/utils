/**
 * 该组件提供解析 html 字符串转为 Element 的能力
 * 默认原样解析，可以通过传入 renderers 参数覆盖默认行为
 * 当一个 renderer 返回了 undefined 将继续由下一个 renderer 处理
 */
import { html2json } from 'html2json';
import React from 'react';
import { Node, ElementNode, createNode } from './Node';
export * from './Node';

interface Options {
  // eslint-disable-next-line no-use-before-define
  traversers?: Traverser[];
}
export type Traverser = (node: Node) => void;

const safeTags = [
  'a',
  'b',
  'blockquote',
  'code',
  'del',
  'dd',
  'div',
  'dl',
  'dt',
  'em',
  'h1',
  'h2',
  'h3',
  'i',
  'img',
  'kbd',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'sup',
  'sub',
  'strong',
  'strike',
  'ul',
  'br',
  'hr',
  'font',
];

function validateSrc(str: string) {
  if (!str) {
    return true;
  }
  if (str.toLowerCase().startsWith('http://')) {
    return true;
  }
  if (str.toLowerCase().startsWith('https://')) {
    return true;
  }
  return false;
}

/** 过滤掉白名单以外的标签 */
function safeTagFilter(node: Node): void {
  if (!(node instanceof ElementNode)) {
    return;
  }
  if (!safeTags.includes(node.tag.toLowerCase())) {
    node.unlink();
  }
  if (node.attr) {
    Object.keys(node.attr)
      .filter(key => key.toLowerCase().startsWith('on'))
      .forEach(key => {
        delete node.attr[key];
      });
  }
  if (!validateSrc(node.attr?.src as string)) {
    node.unlink();
  }
  if (!validateSrc(node.attr?.href as string)) {
    node.unlink();
  }
}

interface Props {
  value: string;
  safe?: boolean;
  traversers?: Traverser[];
}

function html2Map(string: string): Node {
  const json = html2json(string);
  return createNode(json);
}

function traverse(map: Node, options: Options) {
  const { traversers = [] } = options;
  traversers.forEach(traverser => {
    traverser(map);
  });
  map.children?.forEach(child => {
    if (React.isValidElement(child) || child === null) {
      return;
    }
    traverse(child, options);
  });
}

export const HtmlComponent: React.FC<Props> = ({ value = '', traversers = [], safe = true }) => {
  const htmlMap = html2Map(value);
  traverse(htmlMap, {
    traversers: [...traversers, safe && safeTagFilter].filter(traverser => traverser) as Traverser[],
  });
  console.log(htmlMap);
  return React.createElement('div', { className: 'html-component' }, [htmlMap.render()]);
};
