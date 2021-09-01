import { RouteRecordRaw } from 'vue-router'
import { checkAuth } from '@/router/auth'

export default [
  {
    name: 'movements',
    path: '/movements',
    beforeEnter: checkAuth,
    component: () => import('@/views/movement/MovementList.vue'),
    props: (route) => ({
      fishId: route.query.fishId && Number(route.query.fishId),
      pondId: route.query.pondId && Number(route.query.pondId),
    }),
  },
  {
    name: 'movementEdit',
    path: '/movements/:movementId/edit',
    beforeEnter: checkAuth,
    component: () => import('@/views/movement/MovementForm.vue'),
    props: (route) => ({
      movementId: Number(route.params.movementId),
    }),
  },
  {
    name: 'movementCreate',
    path: '/movements/create',
    beforeEnter: checkAuth,
    component: () => import('@/views/movement/MovementForm.vue'),
    props: (route) => ({
      fishId: route.query.fishId && Number(route.query.fishId),
      pondId: route.query.pondId && Number(route.query.pondId),
      action: route.query.action,
    }),
  },
] as Array<RouteRecordRaw>
