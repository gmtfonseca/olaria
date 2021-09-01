<template>
  <div class="user-log">
    <div v-if="data.createdBy" class="section">
      <div class="section__prefix">
        <i class="pi pi-user-plus" />
        <span>Criado por</span>
      </div>
      <span class="section__user">{{ data.createdBy?.name }}</span>
    </div>
    <div v-if="data.modifiedBy" class="section">
      <div class="section__prefix">
        <i class="pi pi-user-edit" />
        <span>Modificado por</span>
      </div>
      <span class="section__user">{{ data.modifiedBy?.name }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { UserLogData } from '@/data/auth/types'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<UserLogData>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.user-log {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;

  .section {
    display: flex;
    align-items: center;

    &__prefix {
      display: inline-flex;
      gap: 6px;
    }

    &__user {
      margin-left: 4px;
      font-weight: bold;
    }
  }
}
</style>
