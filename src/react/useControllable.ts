/** @module react */
import { useState } from "react";

/**
 * @static
 * @summary 可受控状态
 * @template T
 * @param {Object} param 参数
 * @param {Object} param.value 从 props 中收到的 value
 * @param {Object} param.defaultValue 从 props 中收到的 defaultValue
 * @param {Object} param.value 从 props 中收到的 onChange
 * @return {Array} data
 * @return {Any} data[0] 渲染中使用的值
 * @return {Function} data[1] 修改值的函数
 */
export default function useControllable<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T;
  defaultValue: T;
  onChange: (value: T) => void;
}): [value: T, setValue: (value: T) => void] {
  // 组件是否是受控组件
  const controllableState = useState<boolean>(undefined);
  let [controllable] = controllableState;
  const [, setControllable] = controllableState;

  // 初始化组件的受控状态
  // 受控状态初始化完成后不会再变化
  if (controllable === undefined) {
    if (value === undefined) {
      setControllable(false);
      controllable = false;
    } else {
      setControllable(true);
      controllable = true;
    }
  }

  // 组件内部保存的 value
  const [innerValue, setInnerValue] = useState<T>(
    controllable ? value : defaultValue
  );

  return [
    controllable ? value : innerValue,
    (newValue) => {
      if (newValue instanceof Function) {
        const getValue = newValue;
        newValue = getValue(controllable ? value : innerValue);
      }

      if (onChange instanceof Function) {
        onChange(newValue);
      }

      setInnerValue(newValue);
    },
  ];
}
