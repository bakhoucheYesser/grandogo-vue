// src/router/routes/home.routes.ts
import type { RouteRecordRaw } from 'vue-router';

const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../../views/home/HomePage.vue'),
    meta: {
      requiresAuth: false,
      layout: 'DefaultLayout',
      title: 'Dashboard'
    }
  },
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import('../../views/profile/ProfilePage.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     layout: 'DefaultLayout',
  //     title: 'User Profile'
  //   }
  // }
];

export default homeRoutes;
