/**
 * 该组件提供解析 html 字符串转为 VNode 的能力
 * 默认原样解析，可以通过传入 renderers 参数覆盖默认行为
 * 当一个 renderer 返回了 undefined 将继续由下一个 renderer 处理
 */
import Vue from 'vue';
import type { CreateElement, VNode } from 'vue';
import { html2json } from 'html2json';
import type { Node } from 'html2json';
import { unentriesReducer } from '../common/object';
import { htmlUnescape } from '../browser/escape';

export type { Node } from 'html2json';
export type { VNode, CreateElement } from 'vue';

interface Options {
  scopeId?: string;
  // eslint-disable-next-line no-use-before-define
  renderers?: Renderer[];
}
export type Render = (node: Node) => VNode | string;
export type Renderer = (node: Node, createElement: CreateElement) => VNode | string;

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
  if (!str) return true;
  if (str.toLowerCase().startsWith('http://')) return true;
  if (str.toLowerCase().startsWith('https://')) return true;
  return false;
}

/** 过滤掉白名单以外的标签 */
function xssFilter(node: Node): undefined | null {
  if (node.node !== 'element') return undefined;
  if (!safeTags.includes(node.tag?.toLowerCase())) return null;
  if (node.attr) {
    for (const key in node.attr) {
      if (key.toLowerCase().startsWith('on')) delete node.attr[key];
    }
  }
  if (!validateSrc(node?.attr?.src as string)) return null;
  if (!validateSrc(node?.attr?.href as string)) return null;
  return undefined;
}

function render(node: Node, createElement: CreateElement, options: Options): VNode | string {
  const { renderers = [] } = options;

  // 使用传入的 renderer 渲染
  for (const renderer of renderers) {
    const result = renderer(node, createElement);
    if (result !== undefined) {
      return result;
    }
  }

  // 当传入的 renderer 都没有返回值时
  // 按照 html 节点渲染
  let attr: Record<string, string>;
  const { scopeId = '' } = options;

  const defaultAttrs = {};
  if (scopeId) defaultAttrs[scopeId] = '';

  switch (node.node) {
    case 'comment':
      return null;
    case 'text':
      return htmlUnescape(node.text);
    case 'root':
      return createElement(
        'div',
        { attrs: { ...defaultAttrs } },
        // custom renderer 中不需要手动 render child
        node.child?.map((child) => render(child, createElement, options)),
      );
    default:
      attr = Object.entries(node.attr || {})
        .map(([key, value]) => [key, value instanceof Array ? value.join(' ') : value])
        .reduce<Record<string, string>>(unentriesReducer, {});
      return createElement(
        node.tag,
        {
          attrs: { ...defaultAttrs, ...attr },
          class: attr.class,
          style: attr.style,
        },
        node.child?.map((child) => render(child, createElement, options)),
      );
  }
}

export default Vue.component('HtmlComponent', {
  props: {
    value: {
      type: String,
      required: true,
    },
    scopeId: {
      type: String,
      default: '',
    },
    safe: {
      type: Boolean,
      default: true,
    },
    renderers: {
      type: Array,
      default: () => [],
    },
  },
  render(createElement) {
    const {
      value, scopeId, renderers, safe,
    } = this.$props;
    const htmljson = html2json(value);
    const result = render(htmljson, createElement, {
      scopeId,
      renderers: safe ? [...renderers, xssFilter] : renderers,
    });
    return createElement('div', { class: 'html-component' }, [result]);
  },
});
