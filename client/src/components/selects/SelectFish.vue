<template>
  <OAutoComplete
    ref="autoComplete"
    v-model="modelValueComputed"
    class="select-fish"
    force-selection
    :suggestions="fishes"
    placeholder="Peixe"
    field="name"
    :disabled="loading"
    @complete="searchFish($event)"
  >
    <template #item="slotProps">
      <div
        :class="[
          'select-fish__text',
          { 'select-fish__text--inactive': slotProps.item.inactive },
        ]"
      >
        {{ slotProps.item.name }}
      </div>
    </template>
  </OAutoComplete>
</template>
<script lang="ts">
import { defineComponent, inject, PropType, ref } from 'vue'
import { FishRepositoryKey } from '@/data/injectables'
import { Fish } from '@/data/fish/types'
import { useToast } from '@/util/toast'
import { AutoCompleteEvent, VueComponent } from '@/data/types'

type FishOrQueryOrId = Fish | string | number

export default defineComponent({
  props: {
    modelValue: {
      type: [Object, String, Number] as PropType<FishOrQueryOrId>,
      default: '',
    },
    showInactive: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    const autoComplete = ref<VueComponent>()
    const fishRepository = inject(FishRepositoryKey)
    const { showError } = useToast()
    return {
      autoComplete,
      fishRepository,
      showError,
    }
  },
  data() {
    return {
      fishes: [] as Fish[],
    }
  },
  computed: {
    modelValueComputed: {
      get(): FishOrQueryOrId {
        return this.modelValue
      },
      set(modelValue: FishOrQueryOrId) {
        this.$emit('update:modelValue', modelValue)
      },
    },
    loading() {
      return (
        typeof this.modelValueComputed === 'string' &&
        this.modelValueComputed === 'Carregando...'
      )
    },
  },
  created() {
    if (typeof this.modelValueComputed === 'number') {
      this.loadFish(this.modelValueComputed)
    }
  },
  methods: {
    focus() {
      const input = this.autoComplete?.$el.getElementsByTagName('input')[0]
      input?.focus()
    },
    async searchFish(event: AutoCompleteEvent) {
      try {
        const params = {
          name: event.query,
          inactive: this.showInactive ? undefined : false,
        }
        const fishes = await this.fishRepository?.getFishes(params)
        this.fishes = fishes || []
      } catch (e) {
        this.showError(e.data)
      }
    },
    async loadFish(fishId: number) {
      try {
        this.modelValueComputed = 'Carregando...'
        const fish = await this.fishRepository?.getFish(fishId)
        this.modelValueComputed = fish || ''
      } catch (e) {
        this.modelValueComputed = ''
        this.showError(e.data)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.select-fish {
  width: 100%;

  &__text {
    &--inactive {
      text-decoration: line-through;
    }
  }
}
</style>
