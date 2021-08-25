
import { useState } from "react";

/**
 * 可受控状态
 * @typeParam T value 的类型
 * @param value 从 props 中收到的 value
 * @param defaultValue 从 props 中收到的 defaultValue
 * @param value 从 props 中收到的 onChange
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
}): [T, (value: T) => void] {
  // 初始化组件的受控状态
  // 受控状态初始化完成后不会再变化
  const [controllable] = useState<boolean>(value !== undefined);

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
