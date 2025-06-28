// src/components/layout/DefaultLayout.vue
<template>
  <div class="default-layout flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 bg-indigo-800 text-white">
      <div class="p-4">
        <h2 class="text-xl font-bold">Your App</h2>
      </div>
      <nav class="mt-8">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="block px-4 py-2 hover:bg-indigo-700"
          :class="{ 'bg-indigo-700': isActive(item.path) }"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top navbar -->
      <header class="bg-white shadow">
        <div class="flex items-center justify-between p-4">
          <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
          <div>
            <button
              @click="logout"
              class="px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.ts';

interface NavItem {
  name: string;
  path: string;
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/' },
  { name: 'Profile', path: '/profile' }
];

const pageTitle = computed((): string => {
  return (route.meta.title as string) || 'Dashboard';
});

const isActive = (path: string): boolean => {
  return route.path === path;
};

const logout = (): void => {
  authStore.logout();
};
</script>
