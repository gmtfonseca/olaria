<template>
  <OChip
    :class="['toggle-chip', { 'toggle-chip--active': modelValueComputed }]"
    :label="label"
    @click="toggleState"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    label: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    modelValueComputed: {
      get(): boolean {
        return this.modelValue
      },
      set(modelValue: boolean): void {
        this.$emit('update:modelValue', modelValue)
      },
    },
  },
  methods: {
    toggleState() {
      this.modelValueComputed = !this.modelValueComputed
    },
  },
})
</script>

<style lang="scss" scoped>
.toggle-chip {
  cursor: pointer;
  user-select: none;
  &--active {
    background: var(--primary-color);
    color: white;
  }
}
</style>
