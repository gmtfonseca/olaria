<template>
  <div class="list">
    <OProgressSpinner v-if="loading" class="list__progress" />
    <ListError
      v-else-if="error"
      :title="errorMsg"
      :retry-cb="reloadCb"
      class="list__error"
    />
    <ListEmpty
      v-else-if="!records.length"
      :reload-cb="reloadCb"
      class="list__empty"
    />
    <div v-else>
      <div class="list__records">
        <div v-for="record in records" :key="record.id">
          <slot :record="record" />
        </div>
      </div>

      <InfiniteLoading class="list__infinite" @infinite="infiniteCb" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import ListEmpty from '@/components/ListEmpty.vue'
import ListError from '@/components/ListError.vue'

import InfiniteLoading from '@/components/InfiniteLoading.vue'
import { InfiniteLoadingStateChanger } from '@/data/types'

export default defineComponent({
  components: { ListEmpty, ListError, InfiniteLoading },
  props: {
    records: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    error: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    errorMsg: {
      type: String as PropType<string>,
      default: 'Não foi possível carregar os dados.',
    },
    reloadCb: {
      type: Function as PropType<() => Promise<void>>,
      required: true,
    },
    infiniteCb: {
      type: Function as PropType<
        ($state: InfiniteLoadingStateChanger) => Promise<void>
      >,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.list {
  &__progress,
  &__error,
  &__empty {
    width: 100%;
    padding: 0 24px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &__records {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
