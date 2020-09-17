import { mount } from 'enzyme';
import assert from 'assert';
import React, { useState } from 'react';
import sinon from 'sinon';
import withControllable from '../../src/react/withControllable';

class Counter extends React.Component {
  handleClick = () => {
    const { count, onChange } = this.props;
    onChange(count + 1);
  }

  render() {
    const { count } = this.props;
    return <div id="counter" onClick={this.handleClick}>{`${count}`}</div>;
  }
}

const ControllableCounter = withControllable(Counter);

describe('withControllable', () => {
  it('基本测试', () => {
    const wrapper = mount(<ControllableCounter/>);
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
