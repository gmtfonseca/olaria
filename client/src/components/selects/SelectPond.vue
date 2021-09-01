<template>
  <OAutoComplete
    ref="autoComplete"
    v-model="modelValueComputed"
    class="select"
    force-selection
    :suggestions="ponds"
    placeholder="Açude"
    field="name"
    :disabled="loading"
    @complete="searchPond($event)"
  >
    <template #item="slotProps">
      <div
        :class="[
          'select-pond__text',
          { 'select-pond__text--inactive': slotProps.item.inactive },
        ]"
      >
        {{ slotProps.item.name }}
      </div>
    </template>
  </OAutoComplete>
</template>
<script lang="ts">
import { defineComponent, inject, PropType, ref } from 'vue'
import { PondRepositoryKey } from '@/data/injectables'
import { Pond } from '@/data/pond/types'
import { useToast } from '@/util/toast'
import { AutoCompleteEvent, VueComponent } from '@/data/types'

type PondOrQueryOrId = Pond | string

export default defineComponent({
  props: {
    modelValue: {
      type: [Object, String, Number] as PropType<PondOrQueryOrId>,
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
    const pondRepository = inject(PondRepositoryKey)
    const { showError } = useToast()
    return {
      autoComplete,
      pondRepository,
      showError,
    }
  },
  data() {
    return {
      ponds: [] as Pond[],
    }
  },
  computed: {
    modelValueComputed: {
      get(): PondOrQueryOrId {
        return this.modelValue
      },
      set(modelValue: PondOrQueryOrId) {
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
      this.loadPond(this.modelValueComputed)
    }
  },
  methods: {
    focus() {
      const input = this.autoComplete?.$el.getElementsByTagName('input')[0]
      input?.focus()
    },
    async searchPond(event: AutoCompleteEvent) {
      try {
        const params = {
          name: event.query || undefined,
          inactive: this.showInactive ? undefined : false,
        }
        const ponds = await this.pondRepository?.getPonds(params)
        this.ponds = ponds || []
      } catch (e) {
        this.showError(e.data)
      }
    },
    async loadPond(pondId: number) {
      try {
        this.modelValueComputed = 'Carregando...'
        const pond = await this.pondRepository?.getPond(pondId)
        this.modelValueComputed = pond || ''
      } catch (e) {
        this.modelValueComputed = ''
        this.showError(e.data)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.select-pond {
  width: 100%;

  &__text {
    &--inactive {
      text-decoration: line-through;
    }
  }
}
</style>
