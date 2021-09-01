<template>
  <div class="inventory-list-item" data-test="inventoryListItem">
    <div class="inventory">
      <div class="inventory__name">{{ inventory.name }}</div>
      <div class="inventory__quantity">{{ inventory.quantity }} UN</div>
    </div>
    <div class="edit">
      <i class="pi pi-angle-right"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { InventoryListRecord } from '@/data/inventory/types'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    inventory: {
      type: Object as PropType<InventoryListRecord>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.inventory-list-item {
  background: #ffffff;
  cursor: pointer;
  padding: 10px;
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .inventory {
    display: flex;
    flex-direction: column;

    &__name {
      color: var(--bluegray-900);
      margin-bottom: 10px;
    }

    &__quantity {
      color: var(--bluegray-400);
    }
  }
}
</style>
