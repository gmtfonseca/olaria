<template>
  <div :class="['block-ui', { 'block-ui--blocked': blocked }]">
    <div v-if="blocked" class="overlay"></div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    blocked: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.block-ui {
  &--blocked {
    pointer-events: none;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>
