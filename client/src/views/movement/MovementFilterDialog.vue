<template>
  <ODialog v-model:visible="visibleComputed" header="Filtros" dismissable-mask>
    <div class="filters">
      <OCalendar
        v-model="filtersLocal.date"
        :manual-input="false"
        placeholder="Data"
        show-icon
        touch-u-i
        show-button-bar
      />
      <SelectFish
        v-model="filtersLocal.fishOrId"
        show-inactive
        data-test="fish"
      />
      <SelectPond
        v-model.number="filtersLocal.pondOrId"
        show-inactive
        data-test="pond"
      />
    </div>

    <template #footer>
      <OButton
        label="Limpar"
        icon="pi pi-filter-slash"
        class="p-button-text"
        @click="handleClear"
      />
      <OButton label="Aplicar" data-test="applyFilter" @click="handleApply" />
    </template>
  </ODialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import SelectFish from '@/components/selects/SelectFish.vue'
import SelectPond from '@/components/selects/SelectPond.vue'

import { MovementListFilters } from '@/data/movement/types'

export default defineComponent({
  components: { SelectFish, SelectPond },
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    filters: {
      type: Object as PropType<MovementListFilters>,
      default: null,
    },
  },
  emits: ['update:visible', 'apply'],
  data() {
    return {
      filtersLocal: {} as MovementListFilters,
    }
  },
  computed: {
    visibleComputed: {
      get(): boolean {
        return this.visible
      },
      set(visible: boolean) {
        this.$emit('update:visible', visible)
      },
    },
  },
  watch: {
    visibleComputed() {
      if (this.visibleComputed) {
        this.filtersLocal = { ...this.filters }
      }
    },
  },
  methods: {
    handleClear() {
      this.$emit('apply', {})
      this.closeModal()
    },
    handleApply() {
      this.$emit('apply', this.filtersLocal)
      this.closeModal()
    },
    closeModal() {
      this.visibleComputed = false
    },
  },
})
</script>

<style lang="scss" scoped>
.filters {
  > *:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
