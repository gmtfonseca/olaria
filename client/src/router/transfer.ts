import { RouteRecordRaw } from 'vue-router'
import { checkAuth } from '@/router/auth'

export default [
  {
    path: '/transfers/create',
    beforeEnter: checkAuth,
    component: () => import('@/views/transfer/TransferForm.vue'),
    props: (route) => ({
      fishId: route.query.fishId && Number(route.query.fishId),
      pondOriginId:
        route.query.pondOriginId && Number(route.query.pondOriginId),
      quantity: route.query.quantity && Number(route.query.quantity),
    }),
  },
] as Array<RouteRecordRaw>
