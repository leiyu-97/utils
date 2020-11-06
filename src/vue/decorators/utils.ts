import Vue, { ComponentOptions } from 'vue';

type lifecycles =
  | 'beforeCreate'
  | 'created'
  | 'beforeDestroy'
  | 'destroyed'
  | 'beforeMount'
  | 'mounted'
  | 'beforeUpdate'
  | 'updated'
  | 'activated'
  | 'deactivated';

export function addData(options: ComponentOptions<Vue>, func: () => void): void {
  const { data } = options;

  options.data = function wrappedData(...args) {
    const newData = func.call(this, ...args);

    if (data instanceof Function) {
      const rawData = data.call(this, ...args);
      return {
        ...rawData,
        ...newData,
      };
    }

    if (data instanceof Object) {
      return {
        ...data,
        ...newData,
      };
    }

    return newData;
  };
}

export function addLifecycle(
  name: lifecycles,
  options: ComponentOptions<Vue>,
  func: () => void,
): void {
  const rawFunc = options[name];

  options[name] = function () {
    if (rawFunc instanceof Function) rawFunc.call(this);
    func.call(this);
  };
}

export function addBeforeCreate(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('beforeCreate', options, func);
}

export function addCreated(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('beforeCreate', options, func);
}

export function addBeforeDestroy(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('beforeDestroy', options, func);
}

export function addDestroyed(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('destroyed', options, func);
}

export function addBeforeMount(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('beforeMount', options, func);
}

export function addMounted(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('mounted', options, func);
}

export function addBeforeUpdate(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('beforeUpdate', options, func);
}

export function addUpdated(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('updated', options, func);
}

export function addActivated(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('activated', options, func);
}

export function addDeactivated(options: ComponentOptions<Vue>, func: () => void): void {
  addLifecycle('deactivated', options, func);
}
