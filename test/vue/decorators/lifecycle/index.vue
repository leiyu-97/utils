<template>
  <div />
</template>
<script lang="ts">
import {
  Component, Emit, Vue,
} from 'vue-property-decorator';
import assert from 'power-assert';
import {
  BeforeCreate, Created, BeforeMount, Mounted,
} from '../../../../src/vue/decorators/lifecycles';

/* eslint-disable class-methods-use-this, @typescript-eslint/no-empty-function */
@Component
class AwemeList extends Vue {
  @BeforeCreate
  @Emit('beforeCreate')
  handleBeforeCreate(): void {
    this.beforeCreate = true;
    assert(!this.created);
  }

  @Created
  @Emit('created')
  handleCreated(): void {
    this.created = true;
    assert(this.beforeCreate);
    assert(!this.beforeMount);
  }

  @BeforeMount
  @Emit('beforeMount')
  handleBeforeMount(): void {
    this.beforeMount = true;
    assert(this.created);
    assert(!this.mounted);
  }

  @Mounted
  @Emit('mounted')
  handleMounted(): void {
    this.mounted = true;
    assert(this.beforeMount);
  }
}
export default AwemeList;
</script>
