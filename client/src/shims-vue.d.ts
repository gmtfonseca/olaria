declare module '@vue/runtime-core' {
  import { ComponentCustomProperties } from 'vue'
  import { Store } from 'vuex'

  interface ComponentCustomProperties {
    $store: Store<import('@/store/types').StoreState>
  }
}

export {}
