<template>
  <ODialog
    v-model:visible="visibleComputed"
    :modal="true"
    :show-header="false"
    dismissable-mask
    content-style="padding: 0"
    :breakpoints="{ '640px': '90vw' }"
    :style="{ width: '512px' }"
    data-test="inventorySummaryDialog"
  >
    <div class="actions">
      <div class="history" data-test="history" @click="handleHistory">
        <i class="pi pi-calendar"></i>
        <div>Histórico</div>
      </div>
      <div class="transfer" data-test="transfer" @click="handleTransfer">
        <i class="pi pi-sort-alt"></i>
        <div>Transferência</div>
      </div>
      <div class="in" data-test="in" @click="handleIn">
        <i class="pi pi-plus"></i>
        <div>Entrada</div>
      </div>
      <div class="out" data-test="out" @click="handleOut">
        <i class="pi pi-minus"></i>
        <div>Saída</div>
      </div>
    </div>
  </ODialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  components: {},
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: [
    'update:visible',
    'view-history',
    'create-in',
    'create-out',
    'create-transfer',
  ],
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
  methods: {
    handleHistory() {
      this.$emit('view-history')
    },
    handleIn() {
      this.$emit('create-in')
    },
    handleOut() {
      this.$emit('create-out')
    },
    handleTransfer() {
      this.$emit('create-transfer')
    },
    closeModal() {
      this.visibleComputed = false
    },
  },
})
</script>

<style lang="scss" scoped>
.actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  color: #fff;
  text-align: center;

  > div {
    height: 128px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    user-select: none;
    cursor: pointer;
  }

  .history {
    background: var(--bluegray-500);
  }

  .transfer {
    background: var(--bluegray-600);
  }

  .in {
    background: var(--bluegray-700);
  }

  .out {
    background: var(--bluegray-800);
  }
}
</style>
