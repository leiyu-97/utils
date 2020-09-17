/** @module react */
import React from 'react';
import useControllable from './useControllable';

/**
 * @static
 * @summary 将一个完全受控组件转化为可受控组件
 * @param {React.Component} Component 完全受控组件
 * @param {Object} [options] 选项
 * @param {String} [options.valueKey="value"] value 的键名
 * @param {String} [options.defaultValueKey="defaultValue"] defaultValue 的键名
 * @param {String} [options.onChange="onChange"] onChange 的键名
 * @return {React.Component} 可受控组件
 */
export default function withControllable(
  Component,
  {
    valueKey = 'value',
    defaultValueKey = 'defaultValue',
    onChangeKey = 'onChange',
  } = {},
) {
  return function (props) {
    const [value, onChange] = useControllable({
      value: props[valueKey],
      defaultValue: props[defaultValueKey],
      onChange: props[onChangeKey],
    });

    const newProps = {
      ...props,
      [valueKey]: value,
      [onChangeKey]: onChange,
    };

    return <Component {...newProps} />;
  };
}
