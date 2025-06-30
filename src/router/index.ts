// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { authGuard } from './guards';
import authRoutes from './routes/auth.routes';
import homeRoutes from './routes/home.routes';
import estimateRoutes from './routes/estimate.routes'; // Add this import

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...homeRoutes,
  ...estimateRoutes, // Add estimate routes
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Apply global navigation guard
router.beforeEach(authGuard);

export default router;
