<template>
  <OToast :breakpoints="breakpoints.toast" data-test="toast" />
  <OConfirmDialog />
  <SideMenu v-model:visible="sideMenuVisible" />

  <router-view v-slot="{ Component, route }">
    <transition
      :enter-active-class="route.meta.enterActiveClass"
      :leave-active-class="route.meta.leaveActiveClass"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import SideMenu from '@/components/SideMenu.vue'

export default defineComponent({
  components: { SideMenu },
  data() {
    return {
      breakpoints: {
        toast: {
          '576px': { width: '100%', left: '0', right: '0' },
        },
      },
    }
  },
  computed: {
    sideMenuVisible: {
      get(): boolean {
        return this.$store.getters.expanded
      },
      set(visible: boolean): void {
        if (visible) {
          this.$store.commit('expandSideMenu')
        } else {
          this.$store.commit('collapseSideMenu')
        }
      },
    },
  },
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&family=Roboto:wght@100&display=swap');

body {
  margin: 0;
  background: #ece7e7;
}

#app {
  font-family: 'Open Sans', sans-serif;
  color: var(--bluegray-700);
}

.p-autocomplete-input,
.p-inputtext,
.p-datepicker,
.p-inputwrapper,
.p-inputnumber {
  width: 100%;
}

.animate__animated.animate__zoomIn,
.animate__animated.animate__zoomOut {
  --animate-duration: 0.4s;
}

.animate__animated.animate__slideInRight,
.animate__animated.animate__slideOutLeft,
.animate__animated.animate__slideInLeft,
.animate__animated.animate__slideOutRight {
  --animate-duration: 0.4s;
}
</style>
