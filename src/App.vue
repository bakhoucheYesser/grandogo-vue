<template>
  <MainLayout>
    <router-view />
  </MainLayout>
  <!-- Add ToastContainer here, outside of MainLayout so it's always visible -->
  <ToastContainer />
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './components/layout/DefaultLayout.vue'
import GuestLayout from './components/layout/GuestLayout.vue'
import MainLayout from './components/layouts/MainLayout.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()

// Define available layouts with a more specific type
const layouts = {
  DefaultLayout: markRaw(DefaultLayout),
  GuestLayout: markRaw(GuestLayout),
}

const authStore = useAuthStore()

// Create a type that represents the keys of the layouts object
type LayoutName = keyof typeof layouts

// Determine layout based on route metadata
const layout = computed(() => {
  // Cast the layoutName to LayoutName if it exists in layouts, otherwise use 'DefaultLayout'
  const layoutName = (route.meta.layout as string) || 'DefaultLayout'

  // Check if the layoutName is a valid key in layouts
  if (layoutName in layouts) {
    return layouts[layoutName as LayoutName]
  }

  // Fallback to DefaultLayout
  return layouts.DefaultLayout
})
</script>
