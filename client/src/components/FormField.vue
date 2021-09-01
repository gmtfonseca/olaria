<template>
  <div>
    <div class="field">
      <label class="field__label" for="field">{{ label }}</label>
      <slot v-if="!loading" id="field" />
      <OSkeleton v-else height="30px" />
    </div>
    <small v-if="invalid" class="p-error">{{ invalidMessage }} </small>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    label: {
      type: String as PropType<string>,
      required: true,
    },
    invalid: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    invalidMessage: {
      type: String as PropType<string>,
      default: 'Campo inválido.',
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.field {
  &__label {
    margin-bottom: 10px;
    display: block;
    font-size: 13px;
  }
}
</style>
