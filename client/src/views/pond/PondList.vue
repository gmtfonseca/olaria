<template>
  <div class="main">
    <SearchNavBar
      v-model:search="searchText"
      title="Açudes"
      navigation="menu"
      search-placeholder="Pesquisar por nome..."
    />

    <div class="content">
      <ListWrapper
        :records="ponds"
        :loading="loading"
        :error="error"
        error-msg="Não foi possível carregar seus açudes."
        :reload-cb="loadPonds"
        data-test="pondList"
      >
        <template #default="slotProps">
          <PondListItem
            :pond="slotProps.record"
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

import { GetPondsParams, Pond } from '@/data/pond/types'
import { PondRepositoryKey } from '@/data/injectables'
import { DEBOUNCE_INTERVAL } from '@/config'

import { useToast } from '@/util/toast'
import { useHttpErrorHandler } from '@/util/http-error-handler'

import PondListItem from '@/views/pond/PondListItem.vue'
import SearchNavBar from '@/components/navbar/SearchNavBar.vue'
import ActionBar from '@/components/ActionBar.vue'
import ActionButton from '@/components/ActionButton.vue'
import ListWrapper from '@/components/ListWrapper.vue'

export default defineComponent({
  components: {
    PondListItem,
    SearchNavBar,
    ActionBar,
    ActionButton,
    ListWrapper,
  },
  setup: () => {
    const pondRepository = inject(PondRepositoryKey)
    const toast = useToast()
    const { handleHttpError } = useHttpErrorHandler(toast)
    return { pondRepository, handleHttpError }
  },
  data() {
    return {
      error: false,
      loading: false,
      searchText: '',
      ponds: [] as Pond[],
    }
  },
  watch: {
    searchText() {
      this.loading = true
      this.loadPondsDebounced()
    },
  },
  created() {
    this.loadPonds()
  },
  methods: {
    handleEdit(pondId: string): void {
      this.$router.push({ path: `/ponds/${pondId}/edit` })
    },
    handleCreate(): void {
      this.$router.push({ path: '/ponds/create' })
    },
    async loadPonds(): Promise<void> {
      try {
        this.error = false
        this.loading = true
        const params: GetPondsParams = {}
        if (this.searchText) {
          params.name = this.searchText
        }
        const ponds = await this.pondRepository?.getPonds(params)
        this.ponds = ponds || []
      } catch (e) {
        this.error = true
        this.handleHttpError(e.data)
      } finally {
        this.loading = false
      }
    },
    loadPondsDebounced: debounce(function (this: { loadPonds: () => void }) {
      this.loadPonds()
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
