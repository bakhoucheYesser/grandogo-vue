// src/router/guards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import  { useAuthStore } from '../stores/auth.store';

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {

    return next({ name: 'home' });
  }

  next();
}
