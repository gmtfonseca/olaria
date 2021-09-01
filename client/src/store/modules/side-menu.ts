import { SideMenuState } from '@/store/types'

const state = {
  expanded: false,
}

const mutations = {
  expandSideMenu(state: SideMenuState): void {
    state.expanded = true
  },
  collapseSideMenu(state: SideMenuState): void {
    state.expanded = false
  },
}

const getters = {
  expanded: (state: SideMenuState): boolean => state.expanded,
}

export default {
  state,
  mutations,
  getters,
}
