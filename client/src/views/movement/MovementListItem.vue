<template>
  <div class="movement-list-item" data-test="movementListItem">
    <div :class="['action', actionStyle]" />
    <div class="movement">
      <div class="section">
        <div class="movement__pond">{{ movement.pond.name }}</div>
        <div class="movement__datetime">
          {{ $filters.date(movement.datetime) }}
        </div>
      </div>
      <div class="section">
        <div class="movement__fish">{{ movement.fish.name }}</div>
        <div class="movement__quantity">{{ movement.quantity }} UN</div>
      </div>
      <div v-if="movement.notes" class="section">
        <div class="movement__notes">"{{ movement.notes }}"</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MovementPopulated } from '@/data/movement/types'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    movement: {
      type: Object as PropType<MovementPopulated>,
      required: true,
    },
  },
  computed: {
    actionStyle(): string {
      return this.movement.action === 'IN' ? 'action--in' : 'action--out'
    },
  },
})
</script>

<style lang="scss" scoped>
.movement-list-item {
  background: #ffffff;
  display: flex;
  width: 100%;
  cursor: pointer;

  .action {
    width: 10px;

    &--in {
      background: var(--green-300);
    }

    &--out {
      background: var(--yellow-300);
    }
  }

  .movement {
    display: flex;
    flex-direction: column;
    padding: 10px;
    width: 100%;
    font-size: 13px;
    gap: 10px;
    color: var(--bluegray-900);

    .section {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    &__notes {
      color: var(--bluegray-600);
      font-size: 12px;
    }
  }
}
</style>
