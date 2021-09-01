import {
  createRouter,
  createWebHashHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
  RouterScrollBehavior,
} from 'vue-router'

import fishRoutes from '@/router/fish'
import pondRoutes from '@/router/pond'
import inventoryRoutes from '@/router/inventory'
import movementRoutes from '@/router/movement'
import transferRoutes from '@/router/transfer'
import { checkAuth } from '@/router/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/signin',
    component: () => import('@/views/signin/SigninForm.vue'),
  },
  {
    path: '/',
    beforeEnter: checkAuth,
    redirect: '/inventories',
  },
  ...fishRoutes,
  ...pondRoutes,
  ...inventoryRoutes,
  ...movementRoutes,
  ...transferRoutes,
]

const scrollBehavior: RouterScrollBehavior = () => {
  return { top: 0 }
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior,
})

router.afterEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    handleTransitions(to, from)
  }
)

function handleTransitions(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) {
  const slideRight = () => {
    to.meta.enterActiveClass = 'animate__animated animate__slideInRight'
    to.meta.leaveActiveClass = 'animate__animated animate__slideOutLeft'
  }

  const slideLeft = () => {
    to.meta.enterActiveClass = 'animate__animated animate__slideInLeft'
    to.meta.leaveActiveClass = 'animate__animated animate__slideOutRight'
  }

  const zoomIn = () => {
    to.meta.enterActiveClass = 'animate__animated animate__zoomIn'
  }

  const zoomOut = () => {
    to.meta.enterActiveClass = 'animate__animated animate__fadeIn'
    to.meta.leaveActiveClass = 'animate__animated animate__zoomOut'
  }

  const fadeIn = () => {
    to.meta.enterActiveClass = 'animate__animated animate__fadeIn'
  }

  // Pond
  if (from.name === 'ponds' && to.name === 'pondEdit') {
    slideRight()
  } else if (from.name === 'pondEdit' && to.name === 'ponds') {
    slideLeft()
  } else if (from.name === 'ponds' && to.name === 'pondCreate') {
    zoomIn()
  } else if (from.name === 'pondCreate' && to.name === 'ponds') {
    zoomOut()
  }
  // Fish
  else if (from.name === 'fishes' && to.name === 'fishEdit') {
    slideRight()
  } else if (from.name === 'fishEdit' && to.name === 'fishes') {
    slideLeft()
  } else if (from.name === 'fishes' && to.name === 'fishCreate') {
    zoomIn()
  } else if (from.name === 'fishCreate' && to.name === 'fishes') {
    zoomOut()
  }
  // Inventory
  else if (from.name === 'inventories' && to.name === 'inventorySummary') {
    slideRight()
  } else if (from.name === 'inventorySummary' && to.name === 'inventories') {
    slideLeft()
  }
  // Movement
  else if (from.name === 'movements' && to.name === 'movementEdit') {
    slideRight()
  } else if (from.name === 'movementEdit' && to.name === 'movements') {
    slideLeft()
  } else if (from.name === 'movements' && to.name === 'movementCreate') {
    zoomIn()
  } else if (from.name === 'movementCreate' && to.name === 'movements') {
    zoomOut()
  } else {
    fadeIn()
  }
}

export default router
