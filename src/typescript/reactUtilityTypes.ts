import { Component } from 'react';

export type ReactConstructor<P = any, S = any, SS = any> = new (props: P) => Component<P, S, SS>;
/** React 组件某个属性的类型 */
export type ReactPropType<T extends Component | ((props: any) => void)> = T extends (props: infer P) => void
  ? P
  : T extends Component<infer P2>
    ? P2
    : never;
