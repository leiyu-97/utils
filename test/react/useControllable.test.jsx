import React, { useState } from 'react';
import { shallow, mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import useControllable from '../../src/react/useControllable';

function ControllableCounter({ value, defaultValue, onChange }) {
  const [count, setCount] = useControllable({ value, defaultValue, onChange });
  return <div id="counter" onClick={() => setCount((prev) => prev + 1)}>{`${count}`}</div>;
}

describe('useControllable', () => {
  it('基本测试', () => {
    const wrapper = shallow(<ControllableCounter/>);
    const counter = wrapper.find('#counter');
    assert(counter.text() === '0');
    counter.simulate('click');
    assert(counter.text() === '1');
  });

  it('受控组件', () => {
    function App() {
      const [value, setValue] = useState(0);
      return <ControllableCounter value={value} onChange={setValue}/>;
    }

    const wrapper = mount(<App/>);
    const counter = wrapper.find('#counter');
    assert(counter.text() === '0');
    counter.simulate('click');
    assert(counter.text() === '1');
  });

  it('受控组件未传 onChange', () => {
    function App() {
      const [value] = useState(0);
      return <ControllableCounter value={value}/>;
    }

    const wrapper = mount(<App/>);
    const counter = wrapper.find('#counter');
    assert(counter.text() === '0');
    counter.simulate('click');
    assert(counter.text() === '0');
  });

  it('非受控组件', () => {
    const obj = {
      onChange() {},
    };
    sinon.spy(obj, 'onChange');
    function App() {
      return <ControllableCounter defaultValue={0} onChange={obj.onChange}/>;
    }

    const wrapper = mount(<App/>);
    const counter = wrapper.find('#counter');
    counter.simulate('click');
    counter.simulate('click');

    const spyCall0 = obj.onChange.getCall(0);
    const spyCall1 = obj.onChange.getCall(1);

    assert(spyCall0[0] === 1);
    assert(spyCall1[0] === 2);
  });
});
