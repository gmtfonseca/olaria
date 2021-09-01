<template>
  <div class="wrapper">
    <div class="p-input-icon-left p-input-filled search">
      <i class="pi pi-search search__icon" />
      <OInputText
        ref="searchInput"
        v-model="modelValueComputed"
        filled
        class="search__value"
        type="text"
        data-test="searchInput"
        :placeholder="placeholder"
      />
    </div>
    <div class="cancel" @click="handleCancel">
      <i class="pi pi-times"></i>
    </div>
  </div>
</template>
<script lang="ts">
import { VueComponent } from '@/data/types'
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
    placeholder: {
      type: String as PropType<string>,
      default: 'Pesquisar...',
    },
  },
  emits: ['update:modelValue', 'cancel'],
  setup() {
    const searchInput = ref<VueComponent>()
    return { searchInput }
  },
  computed: {
    modelValueComputed: {
      get(): string {
        return this.modelValue
      },
      set(modelValue: string) {
        this.$emit('update:modelValue', modelValue)
      },
    },
  },
  methods: {
    handleCancel() {
      this.modelValueComputed = ''
      this.$emit('cancel')
    },
    focus() {
      this.searchInput?.$el.focus()
    },
  },
})
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  width: 100%;

  .search {
    width: 100%;
    margin-right: 10px;

    &__value {
      width: 100%;
    }
  }

  .cancel {
    cursor: pointer;
  }
}
</style>
