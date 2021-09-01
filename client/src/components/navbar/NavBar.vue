<template>
  <div class="wrapper">
    <div class="nav">
      <div v-if="navigation === 'menu'" class="nav__menu" @click="handleMenu">
        <i class="pi pi-bars menu__icon"></i>
      </div>
      <div
        v-else-if="navigation === 'back'"
        class="nav__back"
        @click="handleBack"
      >
        <i class="pi pi-arrow-left"></i>
      </div>
    </div>

    <slot name="body" />
  </div>
</template>

<script lang="ts">
import { NavigationOpts } from '@/data/types'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  components: {},
  props: {
    navigation: {
      type: String as PropType<NavigationOpts>,
      default: 'none',
      validator: (value: NavigationOpts) =>
        ['menu', 'back', 'none'].includes(value),
    },
  },
  methods: {
    handleBack() {
      this.$router.back()
    },
    handleMenu() {
      this.$store.commit('expandSideMenu')
    },
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 2px 5px -1px gray;
  height: 56px;
  padding: 12px 18px;
  font-size: 18px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 99;

  .nav__menu,
  .nav__back {
    cursor: pointer;
    margin-right: 20px;
  }
}
</style>
