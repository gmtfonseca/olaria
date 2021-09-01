import { RouteRecordRaw } from 'vue-router'
import { checkAuth } from '@/router/auth'

export default [
  {
    name: 'fishes',
    path: '/fishes',
    beforeEnter: checkAuth,
    component: () => import('@/views/fish/FishList.vue'),
  },
  {
    name: 'fishEdit',
    path: '/fishes/:fishId/edit',
    beforeEnter: checkAuth,
    component: () => import('@/views/fish/FishForm.vue'),
    props: (route) => ({
      fishId: Number(route.params.fishId),
    }),
  },
  {
    name: 'fishCreate',
    path: '/fishes/create',
    beforeEnter: checkAuth,
    component: () => import('@/views/fish/FishForm.vue'),
  },
] as Array<RouteRecordRaw>
