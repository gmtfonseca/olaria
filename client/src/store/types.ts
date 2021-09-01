export interface SideMenuState {
  expanded: boolean
}

export interface StoreState {
  auth: AuthState
  sideMenu: SideMenuState
}

export interface AuthState {
  token?: string
}
