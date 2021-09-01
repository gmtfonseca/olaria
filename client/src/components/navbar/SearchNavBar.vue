<template>
  <NavBar :navigation="navigation" class="nav">
    <template #body>
      <transition name="fadeIn">
        <div v-if="showTitle" class="nav__title">{{ title }}</div>
      </transition>

      <transition
        name="grow"
        @before-enter="beforeAnimateSearchBar"
        @after-leave="afterAnimateSearchBar"
      >
        <SearchBar
          v-show="searching"
          ref="searchBar"
          v-model="searchComputed"
          class="nav__search"
          :placeholder="searchPlaceholder"
          @cancel="closeSearch"
        />
      </transition>

      <transition name="fadeIn">
        <div
          v-show="showToggle"
          class="nav__toggle"
          data-test="searchToggle"
          @click="openSearch"
        >
          <i class="pi pi-search"></i>
        </div>
      </transition>
    </template>
  </NavBar>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, nextTick } from 'vue'

import NavBar from '@/components/navbar/NavBar.vue'
import SearchBar from '@/components/SearchBar.vue'
import { NavigationOpts, Focusable } from '@/data/types'

export default defineComponent({
  components: { NavBar, SearchBar },
  props: {
    search: {
      type: String as PropType<string>,
      default: '',
    },
    navigation: {
      type: String as PropType<NavigationOpts>,
      default: 'none',
      validator: (value: NavigationOpts) =>
        ['menu', 'back', 'none'].includes(value),
    },
    title: {
      type: String as PropType<string>,
      required: true,
    },
    searchPlaceholder: {
      type: String as PropType<string>,
      default: 'Pesquisar...',
    },
  },
  emits: ['update:search'],
  setup() {
    const searchBar = ref<Focusable>()
    return { searchBar }
  },
  data() {
    return {
      searching: false,
      showTitle: true,
      showToggle: true,
    }
  },
  computed: {
    searchComputed: {
      get(): string {
        return this.search
      },
      set(search: string) {
        this.$emit('update:search', search)
      },
    },
  },
  methods: {
    async openSearch() {
      this.searching = true
      await nextTick()
      this.searchBar?.focus()
    },
    closeSearch(): void {
      this.searching = false
    },
    openSideMenu(): void {
      this.$store.commit('expandSideMenu')
    },
    beforeAnimateSearchBar(): void {
      this.showTitle = false
      this.showToggle = false
    },
    afterAnimateSearchBar(): void {
      this.showTitle = true
      this.showToggle = true
    },
  },
})
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  align-items: center;
  width: 100%;

  .nav__title {
    margin-right: auto;
    cursor: pointer;
  }

  .nav__toggle {
    cursor: pointer;
  }
}

.fadeIn-leave-from {
  position: absolute;
  opacity: 0;
}

.fadeIn-enter-from {
  opacity: 0;
}

.fadeIn-enter-active {
  transition: opacity 0.4s ease;
}

.grow-leave-to,
.grow-enter-from {
  width: 0;
  opacity: 0;
}

.grow-leave-active,
.grow-enter-active {
  transition: all 0.4s ease;
}
</style>
