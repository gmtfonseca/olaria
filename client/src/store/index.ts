import { createStore } from 'vuex'
import sideMenu from '@/store/modules/side-menu'
import auth from '@/store/modules/auth'
import { StoreState } from '@/store/types'

export default createStore<StoreState>({
  modules: {
    sideMenu,
    auth,
  },
})
