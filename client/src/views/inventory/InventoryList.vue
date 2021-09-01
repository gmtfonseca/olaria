<template>
  <div class="main">
    <SearchNavBar
      ref="searchNavBar"
      v-model:search="searchText"
      title="Inventário"
      navigation="menu"
      :search-placeholder="searchPlaceholder"
    />

    <div class="content">
      <OSelectButton
        v-model="viewModeComputed"
        class="view-mode"
        :options="viewModeOptions"
        option-label="name"
        option-value="value"
        :disabled="loading"
        data-test="viewMode"
      />

      <ListWrapper
        :records="inventories"
        :loading="loading"
        :error="error"
        error-msg="Não foi possível carregar seu inventário."
        :reload-cb="loadInventories"
      >
        <template #default="slotProps">
          <InventoryListItem
            :inventory="slotProps.record"
            @click="openSummary(slotProps.record)"
          />
        </template>
      </ListWrapper>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref } from 'vue'
import { debounce } from 'debounce'

import { InventoryListRecord } from '@/data/inventory/types'
import { SearchNavBarMethods } from '@/data/types'
import { InventoryRepositoryKey } from '@/data/injectables'
import { DEBOUNCE_INTERVAL } from '@/config'

import { useToast } from '@/util/toast'
import { useHttpErrorHandler } from '@/util/http-error-handler'

import SearchNavBar from '@/components/navbar/SearchNavBar.vue'
import ListWrapper from '@/components/ListWrapper.vue'
import InventoryListItem from '@/views/inventory/InventoryListItem.vue'

export default defineComponent({
  components: {
    SearchNavBar,
    ListWrapper,
    InventoryListItem,
  },
  props: {
    viewMode: {
      type: String as PropType<string>,
      default: 'P',
    },
  },
  setup: () => {
    const inventoryRepository = inject(InventoryRepositoryKey)
    const toast = useToast()
    const searchNavBar = ref<SearchNavBarMethods>()
    const { handleHttpError } = useHttpErrorHandler(toast)
    return { inventoryRepository, handleHttpError, searchNavBar }
  },
  data() {
    return {
      viewModeOptions: [
        { name: 'Açude', value: 'P' },
        { name: 'Peixe', value: 'F' },
      ],
      inventories: [] as InventoryListRecord[],
      error: false,
      loading: false,
      searchText: '',
    }
  },
  computed: {
    viewModeComputed: {
      get(): string {
        const viewMode = this.$router.currentRoute.value.query.viewMode
        return String(viewMode)
      },
      set(viewMode: string): void {
        this.setQueryAndLoadInventories(viewMode)
      },
    },
    searchPlaceholder(): string {
      return this.viewModeComputed === 'F'
        ? 'Pesquisar por peixe...'
        : 'Pesquisar por açude...'
    },
  },
  watch: {
    searchText() {
      this.loading = true
      this.loadInventoriesDebounced()
    },
  },
  created() {
    this.viewModeComputed = this.viewMode
    this.loadInventories()
  },
  methods: {
    async setQueryAndLoadInventories(viewMode: string): Promise<void> {
      await this.$router.replace({
        path: this.$router.currentRoute.value.path,
        query: {
          viewMode,
        },
      })
      if (this.searchText) {
        this.searchText = ''
      } else {
        this.loadInventories()
      }
      this.searchNavBar?.closeSearch()
    },
    openSummary(inventory: InventoryListRecord): void {
      this.$router.push({
        path: '/inventories/summary',
        query: {
          viewMode: this.viewModeComputed,
          id: inventory.id,
        },
      })
    },
    async loadInventories(): Promise<void> {
      try {
        this.error = false
        this.loading = true
        const params = {
          name: this.searchText,
        }
        if (this.viewModeComputed === 'F') {
          const fishSummary = await this.inventoryRepository?.getFishesSummary(
            params
          )
          this.inventories =
            fishSummary?.map((record) => ({
              id: record.fish.id,
              name: record.fish.name,
              quantity: record.quantity,
            })) || []
        } else {
          const pondSummary = await this.inventoryRepository?.getPondsSummary(
            params
          )
          this.inventories =
            pondSummary?.map((record) => ({
              id: record.pond.id,
              name: record.pond.name,
              quantity: record.quantity,
            })) || []
        }
      } catch (e) {
        this.error = true
        this.handleHttpError(e.data)
      } finally {
        this.loading = false
      }
    },

    loadInventoriesDebounced: debounce(function (this: {
      loadInventories: () => void
    }) {
      this.loadInventories()
    },
    DEBOUNCE_INTERVAL),
  },
})
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;

  .content {
    .view-mode {
      margin: 16px auto;
      width: 155px;
    }
  }
}
</style>
