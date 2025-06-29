// src/router/routes/auth.routes.ts
import type { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../../views/auth/LoginPage.vue'),
    meta: {
      guestOnly: true,
      layout: 'MainLayout', // Use MainLayout to show navbar and footer
      title: 'Sign In'
    }
  },
  {
    path: '/become-driver',
    name: 'BecomeDriver',
    component: () => import('../../views/auth/ProviderRegistration.vue'),
    meta: {
      guestOnly: true,
      layout: 'MainLayout', // Use MainLayout to show navbar and footer
      title: 'Become a Driver'
    }
  }
];

export default authRoutes;
