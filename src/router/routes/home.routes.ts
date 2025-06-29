// src/router/routes/home.routes.ts
import type { RouteRecordRaw } from 'vue-router';

const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../../views/home/HomePage.vue'),
    meta: {
      requiresAuth: false,
      layout: 'DefaultLayout', // This should use DefaultLayout (with navbar/footer)
      title: 'Home'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../../views/dashboard/DashboardPage.vue'), // Create this if it doesn't exist
    meta: {
      requiresAuth: true,
      layout: 'DefaultLayout',
      title: 'Dashboard'
    }
  }
  // Uncomment when you create the profile page
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
