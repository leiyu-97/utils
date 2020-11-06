import { createDecorator } from 'vue-class-component';
import {
  addActivated,
  addBeforeCreate,
  addBeforeDestroy,
  addBeforeMount,
  addBeforeUpdate,
  addCreated,
  addDeactivated,
  addDestroyed,
  addMounted,
  addUpdated,
} from './utils';

export const BeforeCreate = createDecorator((options, key) => {
  addBeforeCreate(options, function () {
    options.methods[key].call(this);
  });
});

export const Created = createDecorator((options, key) => {
  addCreated(options, function () {
    options.methods[key].call(this);
  });
});

export const BeforeDestroy = createDecorator((options, key) => {
  addBeforeDestroy(options, function () {
    options.methods[key].call(this);
  });
});

export const Destroyed = createDecorator((options, key) => {
  addDestroyed(options, function () {
    options.methods[key].call(this);
  });
});

export const BeforeMount = createDecorator((options, key) => {
  addBeforeMount(options, function () {
    options.methods[key].call(this);
  });
});

export const Mounted = createDecorator((options, key) => {
  addMounted(options, function () {
    options.methods[key].call(this);
  });
});

export const BeforeUpdate = createDecorator((options, key) => {
  addBeforeUpdate(options, function () {
    options.methods[key].call(this);
  });
});

export const Updated = createDecorator((options, key) => {
  addUpdated(options, function () {
    options.methods[key].call(this);
  });
});

export const activated = createDecorator((options, key) => {
  addActivated(options, function () {
    options.methods[key].call(this);
  });
});

export const deactivated = createDecorator((options, key) => {
  addDeactivated(options, function () {
    options.methods[key].call(this);
  });
});
