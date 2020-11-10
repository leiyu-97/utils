import assert from 'power-assert'
import { mount } from '@vue/test-utils'
import LazyShow from '../../../src/vue/LazyShow.vue'

describe('LazyShow', () => {
  test('正常挂载', () => {
    const wrapper = mount(LazyShow)
    assert(wrapper.isVueInstance())
  })
})