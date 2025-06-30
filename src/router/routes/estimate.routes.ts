// src/router/routes/estimate.routes.ts
import type { RouteRecordRaw } from 'vue-router'

const estimateRoutes: RouteRecordRaw[] = [
  {
    path: '/estimate',
    name: 'estimate',
    component: () => import('../../views/estimate/EstimatePage.vue'),
    meta: {
      requiresAuth: false,
      layout: 'MainLayout', // Changed from DefaultLayout to MainLayout
      title: 'Get an Estimate'
    }
  }
];

export default estimateRoutes;
