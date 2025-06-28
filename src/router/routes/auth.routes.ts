// src/router/routes/auth.routes.ts
import type { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../../views/auth/LoginPage.vue'),
    meta: {
      guestOnly: true,
      layout: 'GuestLayout'
    }
  },
  {
    path: '/become-driver',
    name: 'BecomeDriver',
    component: () => import('../../views/auth/ProviderRegistration.vue'),
    meta: {
      guestOnly: true,
      layout: 'GuestLayout'
    }
  }
];

export default authRoutes;
