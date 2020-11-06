<template>
  <div v-show="show" v-if="initialized" class="lazy-show">
    <slot />
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';

@Component({
  data() {
    return {
      initialized: this.show,
    };
  },
})
class LazyShow extends Vue {
  @Prop({ default: true }) show: boolean

  @Watch('show')
  onShowChange(show: boolean):void {
    if (show && !this.initialized) {
      this.initialized = true;
    }
  }
}
export default LazyShow;
</script>
<style lang="scss" scoped>
.lazy-show {
  width: 100%;
  height: 100%;
}
</style>
