import { createDecorator, VueDecorator } from 'vue-class-component';
import { addBeforeDestroy, addMounted } from './utils';

/**
 * 在组件的生命周期内监听 window 的事件
 * @param eventname 监听的事件名
 */
const ListenWindow = (eventname: string): VueDecorator => createDecorator((options, key) => {
  let handler: (e: Event) => void;

  addMounted(options, function () {
    handler = options.methods[key].bind(this);
    window.addEventListener(eventname, handler);
  });

  addBeforeDestroy(options, () => {
    window.removeEventListener(eventname, handler);
  });
});

export default ListenWindow;
