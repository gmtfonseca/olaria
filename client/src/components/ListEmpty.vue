<template>
  <div class="empty">
    <div class="empty__text">{{ text }}</div>
    <OButton
      class="empty__reload"
      icon="pi pi-refresh"
      icon-pos="right"
      label="Recarregar"
      @click="reloadCb"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String as PropType<string>,
      default: 'Sem dados para exibir.',
    },
    reloadCb: {
      type: Function as PropType<() => Promise<void>>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__text {
    margin-bottom: 10px;
  }
}
</style>
