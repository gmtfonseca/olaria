import store from '@/store'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  if (store.getters.loggedIn) {
    next()
  } else {
    next('/signin')
  }
}
