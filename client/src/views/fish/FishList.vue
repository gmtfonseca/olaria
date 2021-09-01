<template>
  <div class="main">
    <SearchNavBar
      v-model:search="searchText"
      title="Peixes"
      navigation="menu"
      search-placeholder="Pesquisar por nome..."
    />

    <div class="content">
      <ListWrapper
        :records="fishes"
        :loading="loading"
        :error="error"
        error-msg="Não foi possível carregar seus peixes."
        :reload-cb="loadFishes"
        data-test="fishList"
      >
        <template #default="slotProps">
          <FishListItem
            :fish="slotProps.record"
            @click="handleEdit(slotProps.record.id)"
          />
        </template>
      </ListWrapper>
    </div>

    <ActionBar>
      <ActionButton data-test="actionCreate" @click="handleCreate">
        <i class="pi pi-plus"></i>
      </ActionButton>
    </ActionBar>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { debounce } from 'debounce'
import { DEBOUNCE_INTERVAL } from '@/config'

import { GetFishesParams, Fish } from '@/data/fish/types'
import { FishRepositoryKey } from '@/data/injectables'

import { useToast } from '@/util/toast'
import { useHttpErrorHandler } from '@/util/http-error-handler'

import FishListItem from '@/views/fish/FishListItem.vue'
import SearchNavBar from '@/components/navbar/SearchNavBar.vue'
import ActionBar from '@/components/ActionBar.vue'
import ActionButton from '@/components/ActionButton.vue'
import ListWrapper from '@/components/ListWrapper.vue'

export default defineComponent({
  components: {
    FishListItem,
    SearchNavBar,
    ActionBar,
    ActionButton,
    ListWrapper,
  },
  setup: () => {
    const fishRepository = inject(FishRepositoryKey)
    const toast = useToast()
    const { handleHttpError } = useHttpErrorHandler(toast)
    return { fishRepository, handleHttpError }
  },
  data() {
    return {
      loading: false,
      error: false,
      searchText: '',
      fishes: [] as Fish[],
    }
  },
  watch: {
    searchText() {
      this.loading = true
      this.loadFishesDebounced()
    },
  },
  created() {
    this.loadFishes()
  },
  methods: {
    handleEdit(fishId: string): void {
      this.$router.push({ path: `/fishes/${fishId}/edit` })
    },
    handleCreate(): void {
      this.$router.push({ path: '/fishes/create' })
    },
    async loadFishes(): Promise<void> {
      try {
        this.error = false
        this.loading = true
        const params: GetFishesParams = {}
        params.name = this.searchText || undefined
        const fishes = await this.fishRepository?.getFishes(params)
        this.fishes = fishes || []
      } catch (e) {
        this.error = true
        this.handleHttpError(e.data)
      } finally {
        this.loading = false
      }
    },
    loadFishesDebounced: debounce(function (this: { loadFishes: () => void }) {
      this.loadFishes()
    }, DEBOUNCE_INTERVAL),
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
