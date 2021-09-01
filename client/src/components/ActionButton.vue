<template>
  <div :class="['wrapper', type]">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    type: {
      type: String as PropType<string>,
      default: 'primary',
    },
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: white;
  width: 60px;
  height: 60px;
  cursor: pointer;

  box-shadow: 0px 17px 10px -10px rgba(0, 0, 0, 0.4);
}

.primary {
  background: var(--primary-color);
}

.secondary {
  background: #56717d;
}
</style>
