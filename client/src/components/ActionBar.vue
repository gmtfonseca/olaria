<template>
  <transition name="slide" appear>
    <div class="wrapper">
      <slot />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  right: 15px;
  bottom: 15px;
  display: flex;
  gap: 10px;
}

.slide-enter-from {
  transform: translateY(50px);
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.5s ease-out;
}
</style>
