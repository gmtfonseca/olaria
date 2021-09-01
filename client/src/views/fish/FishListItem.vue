<template>
  <div class="fish-list-item" data-test="fishListItem">
    <div :class="['status', statusStyle]" />
    <div class="fish">
      <div class="fish__name">
        {{ fish.name }}
      </div>

      <div class="fish__edit">
        <i class="pi pi-angle-right"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Fish } from '@/data/fish/types'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    fish: {
      type: Object as PropType<Fish>,
      required: true,
    },
  },
  computed: {
    statusStyle(): string {
      return this.fish.inactive ? 'status--inactive' : 'status--active'
    },
    severity(): string {
      return this.fish.inactive ? 'warning' : 'success'
    },
  },
})
</script>

<style lang="scss" scoped>
.fish-list-item {
  background: #ffffff;
  display: flex;
  height: 100%;
  width: 100%;
  cursor: pointer;

  .status {
    width: 10px;

    &--active {
      background: var(--green-300);
    }

    &--inactive {
      background: var(--yellow-300);
    }
  }

  .fish {
    color: var(--bluegray-900);
    padding: 16px 10px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    &__name {
      font-size: 14px;
    }
  }
}
</style>
