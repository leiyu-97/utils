import assert from 'power-assert';
import { mount } from '@vue/test-utils';
import App from './index.vue';

describe('lifecycle', () => {
  const wrapper = mount(App);
  test('beforeCreate', () => {
    assert(wrapper.emitted().beforeCreate.length === 1);
  });
  test('created', () => {
    assert(wrapper.emitted().created.length === 1);
  });
  test('beforeMount', () => {
    assert(wrapper.emitted().beforeMount.length === 1);
  });
  test('mounted', () => {
    assert(wrapper.emitted().mounted.length === 1);
  });
});
