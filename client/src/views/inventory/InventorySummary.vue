<template>
  <div class="main">
    <BlockUI :blocked="busy">
      <NavBar navigation="back">
        <template #body>
          <div class="nav__title">{{ title }}</div>
        </template>
      </NavBar>

      <div class="body">
        <div v-if="loaded" class="summary">
          <div class="summary__name" data-test="headerName">
            {{ header.name }}
          </div>
          <div class="summary__quantity" data-test="headerQuantity">
            {{ header.quantity }} UN
          </div>
        </div>

        <OButton
          v-if="viewMode === 'P' && loaded"
          class="p-button-secondary"
          label="ESVAZIAR AÇUDE"
          :loading="draining"
          data-test="drainPond"
          @click="handleDrainPond"
        />

        <div class="list">
          <ListWrapper
            :records="body"
            :loading="!loaded"
            :error="error.body"
            error-msg="Não foi possível carregar seu inventário."
            :reload-cb="loadBody"
          >
            <template #default="slotProps">
              <InventorySummaryItem
                :inventory="slotProps.record"
                @click="openInventorySummaryDialog(slotProps.record)"
              />
            </template>
          </ListWrapper>
        </div>
      </div>
    </BlockUI>

    <InventorySummaryDialog
      v-model:visible="inventorySummaryDialogVisible"
      @view-history="handleViewHistory"
      @create-in="handleCreateIn"
      @create-out="handleCreatOut"
      @create-transfer="handleCreateTransfer"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, inject } from 'vue'

import { InventoryRepositoryKey } from '@/data/injectables'
import { InventoryListRecord } from '@/data/inventory/types'

import { useToast } from '@/util/toast'
import { useHttpErrorHandler } from '@/util/http-error-handler'

import BlockUI from '@/components/BlockUI.vue'
import NavBar from '@/components/navbar/NavBar.vue'
import ListWrapper from '@/components/ListWrapper.vue'
import InventorySummaryItem from '@/views/inventory/InventorySummaryItem.vue'
import InventorySummaryDialog from '@/views/inventory/InventorySummaryDialog.vue'

export default defineComponent({
  components: {
    NavBar,
    InventorySummaryItem,
    ListWrapper,
    InventorySummaryDialog,
    BlockUI,
  },
  props: {
    viewMode: {
      type: String as PropType<string>,
      default: 'P',
    },
    id: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup() {
    const inventoryRepository = inject(InventoryRepositoryKey)
    const toast = useToast()
    const { handleHttpError } = useHttpErrorHandler(toast)
    return { inventoryRepository, handleHttpError, ...toast }
  },
  data() {
    return {
      loading: {
        header: false,
        body: false,
      },
      draining: false,
      error: {
        header: false,
        body: false,
      },
      header: {
        name: '',
        quantity: 0,
      },
      body: [] as InventoryListRecord[],
      inventorySummaryDialogVisible: false,
      selectedInventory: {} as InventoryListRecord,
    }
  },
  computed: {
    title(): string {
      return this.viewMode === 'P' ? 'Inv. por Açude' : 'Inv. por Peixe'
    },
    fishId(): number {
      return this.viewMode === 'P' ? this.selectedInventory.id : this.id
    },
    pondId(): number {
      return this.viewMode === 'F' ? this.selectedInventory.id : this.id
    },
    busy(): boolean {
      return this.loading.header || this.loading.body || this.draining
    },
    loaded(): boolean {
      return !this.loading.header && !this.loading.body
    },
  },
  created() {
    this.loadHeader()
    this.loadBody()
  },
  methods: {
    openInventorySummaryDialog(inventory: InventoryListRecord) {
      this.selectedInventory = inventory
      this.inventorySummaryDialogVisible = true
    },
    handleViewHistory() {
      this.$router.push({
        path: '/movements',
        query: {
          fishId: this.fishId,
          pondId: this.pondId,
        },
      })
    },
    handleCreateIn() {
      this.$router.push({
        path: '/movements/create',
        query: {
          fishId: this.fishId,
          pondId: this.pondId,
          action: 'IN',
        },
      })
    },
    handleCreatOut() {
      this.$router.push({
        path: '/movements/create',
        query: {
          fishId: this.fishId,
          pondId: this.pondId,
          action: 'OUT',
        },
      })
    },
    handleCreateTransfer() {
      this.$router.push({
        path: '/transfers/create',
        query: {
          fishId: this.fishId,
          pondOriginId: this.pondId,
          quantity: this.selectedInventory.quantity,
        },
      })
    },
    async handleDrainPond(): Promise<void> {
      this.$confirm.require({
        message: 'Confirma o esvaziamento do açude?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          await this.drainPond()
        },
      })
    },
    async drainPond(): Promise<void> {
      try {
        this.draining = true
        await this.inventoryRepository?.drainPond(this.pondId)
        this.showSuccess({
          title: 'Tudo certo',
          detail: 'Açude esvaziado com sucesso.',
        })
        this.loadHeader()
        this.loadBody()
      } catch (e) {
        this.handleHttpError(e.data)
      } finally {
        this.draining = false
      }
    },
    async loadHeader(): Promise<void> {
      try {
        this.loading.header = true
        this.error.header = false
        if (this.viewMode === 'F') {
          const fishSummary = await this.inventoryRepository?.getFishSummary(
            this.fishId
          )
          this.header = {
            name: fishSummary?.fish.name || '',
            quantity: fishSummary?.quantity || 0,
          }
        } else {
          const pondSummary = await this.inventoryRepository?.getPondSummary(
            this.pondId
          )
          this.header = {
            name: pondSummary?.pond.name || '',
            quantity: pondSummary?.quantity || 0,
          }
        }
      } catch (e) {
        this.error.header = true
        this.handleHttpError(e.data)
      } finally {
        this.loading.header = false
      }
    },
    async loadBody(): Promise<void> {
      try {
        this.loading.body = true
        this.error.body = false
        if (this.viewMode === 'F') {
          const params = { fishId: this.id }
          const inventories = await this.inventoryRepository?.getInventories(
            params
          )
          this.body =
            inventories?.map((record) => ({
              id: record.pond.id,
              name: record.pond.name,
              quantity: record.quantity,
            })) || []
        } else {
          const params = { pondId: this.id }
          const inventories = await this.inventoryRepository?.getInventories(
            params
          )
          this.body =
            inventories?.map((record) => ({
              id: record.fish.id,
              name: record.fish.name,
              quantity: record.quantity,
            })) || []
        }
      } catch (e) {
        this.error.body = true
        this.handleHttpError(e.data)
      } finally {
        this.loading.body = false
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;

  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px 0;

    .summary {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      font-size: 17px;

      &__name {
        color: var(--bluegray-700);
        font-weight: bold;
      }
      &__quantity {
        color: var(--bluegray-400);
      }
    }

    .list {
      width: 100%;
    }
  }
}
</style>
