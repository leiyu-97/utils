/* eslint-disable no-use-before-define */
declare module 'html2json' {
  export interface ElementNode {
    node: 'element';
    tag: string;
    child?: Node[];
    attr?: Record<string, string | string[]>;
  }
  export interface RootNode {
    node: 'root';
    child?: Node[];
  }
  export interface CommentNode {
    node: 'comment';
    text: string;
  }
  export interface TextNode {
    node: 'text';
    text: string;
  }
  export type Node = ElementNode | RootNode | CommentNode | TextNode;
  export function html2json(xml: string): Node;
  export function json2html(json: Node): string;
}
