<template>
  <div class="main">
    <SearchNavBar
      v-model:search="searchText"
      title="Movimentos"
      :navigation="navigation"
      search-placeholder="Pesquisar por peixe..."
    />

    <div class="content">
      <InfiniteListWrapper
        :records="movements"
        :loading="loading"
        :error="error"
        error-msg="Não foi possível carregar seus movimentos."
        :reload-cb="loadMovements"
        :infinite-cb="handleInfiniteScroll"
      >
        <template #default="slotProps">
          <MovementListItem
            :movement="slotProps.record"
            @click="handleEdit(slotProps.record.id)"
          />
        </template>
      </InfiniteListWrapper>
    </div>

    <ActionBar class="actions">
      <ActionButton
        type="secondary"
        data-test="filter"
        @click="openFilterDialog"
      >
        <i class="pi pi-filter"></i>
      </ActionButton>
      <ActionButton data-test="actionCreate" @click="handleCreate">
        <i class="pi pi-plus"></i>
      </ActionButton>
    </ActionBar>

    <MovementFilterDialog
      v-model:visible="filterDialogVisible"
      :filters="filters"
      :modal="true"
      @apply="handleApplyFilter"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref } from 'vue'
import { debounce } from 'debounce'

import {
  GetMovementsParams,
  MovementListFilters,
  MovementPopulated,
} from '@/data/movement/types'
import { MovementRepositoryKey } from '@/data/injectables'
import { DEBOUNCE_INTERVAL } from '@/config'

import { useToast } from '@/util/toast'
import { useHttpErrorHandler } from '@/util/http-error-handler'

import MovementFilterDialog from '@/views/movement/MovementFilterDialog.vue'
import MovementListItem from '@/views/movement/MovementListItem.vue'
import SearchNavBar from '@/components/navbar/SearchNavBar.vue'
import ActionBar from '@/components/ActionBar.vue'
import ActionButton from '@/components/ActionButton.vue'
import InfiniteListWrapper from '@/components/InfiniteListWrapper.vue'
import { InfiniteLoadingStateChanger } from '@/data/types'

export default defineComponent({
  components: {
    MovementListItem,
    SearchNavBar,
    ActionBar,
    ActionButton,
    MovementFilterDialog,
    InfiniteListWrapper,
  },
  props: {
    fishId: {
      type: Number as PropType<number>,
      default: null,
    },
    pondId: {
      type: Number as PropType<number>,
      default: null,
    },
  },
  setup: () => {
    const movementRepository = inject(MovementRepositoryKey)
    const toast = useToast()
    const movementsComponent = ref<Element>()

    const { handleHttpError } = useHttpErrorHandler(toast)
    return { movementRepository, handleHttpError, movementsComponent }
  },
  data() {
    return {
      error: false,
      loading: false,
      filterDialogVisible: false,
      searchText: '',
      movements: [] as MovementPopulated[],
      filters: {} as MovementListFilters,
    }
  },
  computed: {
    queryMode(): boolean {
      return Boolean(this.fishId || this.pondId)
    },
    navigation(): string {
      return this.queryMode ? 'back' : 'menu'
    },
  },
  watch: {
    searchText() {
      this.loading = true
      this.loadMovementsDebounced()
    },
  },
  created() {
    const { fishId, pondId } = this
    this.filters = {
      fishOrId: fishId,
      pondOrId: pondId,
    }

    this.loadMovements()
  },
  methods: {
    handleEdit(movementId: string): void {
      this.$router.push({ path: `/movements/${movementId}/edit` })
    },
    handleCreate(): void {
      this.$router.push({ path: '/movements/create' })
    },
    handleApplyFilter(filters: MovementListFilters): void {
      this.filters = filters
      this.loadMovements()
    },
    async handleInfiniteScroll($state: InfiniteLoadingStateChanger) {
      try {
        const movements = await this.getMovements({
          skip: this.movements.length,
        })
        if (movements.length) {
          this.movements.push(...movements)
          $state.loaded()
        } else {
          $state.complete()
        }
      } catch (e) {
        $state.error()
        this.handleHttpError(e.data)
      }
    },
    openFilterDialog(): void {
      this.filterDialogVisible = true
    },
    async loadMovements(): Promise<void> {
      try {
        this.error = false
        this.loading = true
        this.movements = await this.getMovements()
      } catch (e) {
        this.error = true
        this.handleHttpError(e.data)
      } finally {
        this.loading = false
      }
    },
    async getMovements({ skip } = { skip: 0 }): Promise<MovementPopulated[]> {
      const { fishOrId, pondOrId, date } = this.filters
      const fishId = typeof fishOrId === 'number' ? fishOrId : fishOrId?.id
      const pondId = typeof pondOrId === 'number' ? pondOrId : pondOrId?.id
      const params: GetMovementsParams = {
        take: 15,
        skip,
        date,
        fishId,
        pondId,
        fishName: this.searchText || undefined,
      }
      const movements = await this.movementRepository?.getMovements(params)
      return movements || []
    },
    loadMovementsDebounced: debounce(function (this: {
      loadMovements: () => void
    }) {
      this.loadMovements()
    },
    DEBOUNCE_INTERVAL),
  },
})
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;

  .content {
    padding: 6px 0;
  }
}
</style>
