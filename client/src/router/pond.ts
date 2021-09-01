import { RouteRecordRaw } from 'vue-router'
import { checkAuth } from '@/router/auth'

export default [
  {
    name: 'ponds',
    path: '/ponds',
    beforeEnter: checkAuth,
    component: () => import('@/views/pond/PondList.vue'),
  },
  {
    name: 'pondEdit',
    path: '/ponds/:pondId/edit',
    beforeEnter: checkAuth,
    component: () => import('@/views/pond/PondForm.vue'),
    props: (route) => ({
      pondId: Number(route.params.pondId),
    }),
  },
  {
    name: 'pondCreate',
    path: '/ponds/create',
    beforeEnter: checkAuth,
    component: () => import('@/views/pond/PondForm.vue'),
  },
] as Array<RouteRecordRaw>
