// src/router/guards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  console.log('🛡️ Auth Guard triggered');
  console.log(`📍 From: ${from.path} → To: ${to.path}`);
  console.log(`👤 User authenticated: ${authStore.isAuthenticated}`);
  console.log(`🎯 Route meta:`, to.meta);

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🚫 Route requires auth but user not authenticated, redirecting to login');
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // Check if route is guest-only and user is authenticated
  else if (to.meta.guestOnly && authStore.isAuthenticated) {
    console.log('🚫 Route is guest-only but user is authenticated, redirecting to home');
    return next({ name: 'home' });
  }

  // Allow navigation
  else {
    console.log('✅ Navigation allowed');
    next();
  }
}
