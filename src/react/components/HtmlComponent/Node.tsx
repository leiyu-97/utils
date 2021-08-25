import * as RawNode from 'html2json';
import React, { ReactElement } from 'react';
import { htmlUnescape } from '../../../browser/escape';

const convertStylesStringToObject = (stringStyles: string) =>
  (typeof stringStyles === 'string' ?
    stringStyles.split(';').reduce((acc, style) => {
      const colonPosition = style.indexOf(':');

      if (colonPosition === -1) {
        return acc;
      }

      const camelCaseProperty = style
          .substr(0, colonPosition)
          .trim()
          .replace(/^-ms-/, 'ms-')
          .replace(/-./g, c => c.substr(1).toUpperCase()),
        value = style.substr(colonPosition + 1).trim();

      return value ? { ...acc, [camelCaseProperty]: value } : acc;
    }, {}) :
    {});

function render(node: Node | string | ReactElement): string | ReactElement {
  if (React.isValidElement(node) || typeof node === 'string') {
    return node;
  }

  return node.render();
}

type Child = Node | ReactElement;
type Attr = Record<string, string> & { style?: Record<string, string> };
abstract class BasicNode {
  parent: Node | null;
  abstract type: string;
  abstract children?: (Child | BasicNode)[];

  constructor(parent: Node | null) {
    this.parent = parent;
  }

  unlink() {
    this.parent?.unlinkChild(this);
  }

  unlinkChild(node: BasicNode) {
    if (!this.children) {
      return;
    }

    const index = this.children.indexOf(node);
    if (index === -1) {
      return;
    }

    this.children.splice(index, 1);
  }

  replaceWith(node: Node | ReactElement) {
    if (!this.parent) {
      return;
    }
    this.parent.replaceChild(this, node);
  }

  replaceChild(node: BasicNode, newNode: Node | ReactElement) {
    if (!this.children) {
      return;
    }

    if (newNode instanceof BasicNode) {
      newNode.unlink();
    }

    const index = this.children.indexOf(node);
    if (index === -1) {
      return;
    }

    this.children.splice(index, 1, newNode);
  }

  insertBefore(node: Node | ReactElement) {
    if (!this.parent) {
      return;
    }
    this.parent.insertChildBefore(this, node);
  }

  insertChildBefore(node: BasicNode, newNode: Node | ReactElement) {
    if (!this.children) {
      return;
    }
    const index = this.children.indexOf(node);
    if (index === -1) {
      return;
    }
    this.children.splice(index, 0, newNode);
  }

  insertAfter(node: Node | ReactElement) {
    if (!this.parent) {
      return;
    }
    this.parent.insertChildAfter(this, node);
  }

  insertChildAfter(node: BasicNode, newNode: Node | ReactElement) {
    if (!this.children) {
      return;
    }
    const index = this.children.indexOf(node);
    if (index === -1) {
      return;
    }
    this.children.splice(index + 1, 0, newNode);
  }
}

export class RootNode extends BasicNode {
  parent = null;
  type = 'root';
  children: Child[];
  constructor(node: RawNode.RootNode) {
    super(null);
    this.children = (node.child || []).map(item => createNode(item, this));
  }

  render() {
    return React.createElement(
      'div',
      {},
      this.children.map(child => render(child))
    );
  }
}

export class CommentNode extends BasicNode {
  type = 'comment';
  children: undefined;
  text: string;
  constructor(node: RawNode.CommentNode, parent: Node) {
    super(parent);
    this.text = node.text;
  }

  render() {
    return '';
  }
}

export class TextNode extends BasicNode {
  type = 'text';
  children: undefined;
  text: string;
  constructor(node: RawNode.TextNode, parent: Node) {
    super(parent);
    this.text = node.text;
  }

  render() {
    return htmlUnescape(this.text);
  }
}

export class ElementNode extends BasicNode {
  type = 'element';
  children: Child[];
  attr: Attr;
  tag: keyof HTMLElementTagNameMap;
  constructor(node: RawNode.ElementNode, parent: Node) {
    super(parent);
    this.children = (node.child || []).map(item => createNode(item, this));
    this.attr = {};
    this.tag = node.tag;
    Object.entries(node.attr || {}).forEach(([key, value]) => {
      let newValue: string;
      if (value instanceof Array) {
        newValue = value.join(' ');
      } else {
        newValue = value;
      }

      if (key === 'style') {
        this.attr[key] = convertStylesStringToObject(newValue);
        return;
      }
      if (key === 'class') {
        this.attr.className = newValue;
        return;
      }
      this.attr[key as keyof Attr] = newValue;
    });
  }

  render() {
    return React.createElement(
      this.tag,
      this.attr,
      this.children.map(child => render(child))
    );
  }
}

export type Node = RootNode | CommentNode | TextNode | ElementNode;

export function createNode(node: RawNode.Node, parent: null | RootNode | ElementNode = null) {
  switch (node.node) {
    case 'root':
      return new RootNode(node);
    case 'text':
      return new TextNode(node, parent as RootNode | ElementNode);
    case 'comment':
      return new CommentNode(node, parent as RootNode | ElementNode);
    case 'element':
    default:
      return new ElementNode(node, parent as RootNode | ElementNode);
  }
}
