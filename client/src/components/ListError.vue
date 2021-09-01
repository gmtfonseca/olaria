<template>
  <div class="error">
    <div class="error__title">{{ title }}</div>
    <OButton
      class="error__retry"
      icon="pi pi-refresh"
      icon-pos="right"
      label="Tentar novamente"
      @click="retryCb"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String as PropType<string>,
      default: 'Erro ao carregar dados.',
    },
    retryCb: {
      type: Function as PropType<() => Promise<void>>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &__title {
    margin-bottom: 10px;
  }
}
</style>
