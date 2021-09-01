<template>
  <div class="pond-list-item" data-test="pondListItem">
    <div :class="['status', statusStyle]" />
    <div class="pond">
      <div class="pond__name">
        {{ pond.name }}
      </div>

      <div class="pond__edit">
        <i class="pi pi-angle-right"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Pond } from '@/data/pond/types'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    pond: {
      type: Object as PropType<Pond>,
      required: true,
    },
  },
  computed: {
    statusStyle(): string {
      return this.pond.inactive ? 'status--inactive' : 'status--active'
    },
    severity(): string {
      return this.pond.inactive ? 'warning' : 'success'
    },
  },
})
</script>

<style lang="scss" scoped>
.pond-list-item {
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

  .pond {
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
