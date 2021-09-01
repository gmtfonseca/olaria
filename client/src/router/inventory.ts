import { RouteRecordRaw } from 'vue-router'
import { checkAuth } from '@/router/auth'

export default [
  {
    name: 'inventories',
    path: '/inventories',
    beforeEnter: checkAuth,
    component: () => import('@/views/inventory/InventoryList.vue'),
    props: (route) => ({
      viewMode: route.query.viewMode,
    }),
  },
  {
    name: 'inventorySummary',
    path: '/inventories/summary',
    beforeEnter: checkAuth,
    component: () => import('@/views/inventory/InventorySummary.vue'),
    props: (route) => ({
      viewMode: route.query.viewMode,
      id: route.query.id && Number(route.query.id),
    }),
  },
] as Array<RouteRecordRaw>
