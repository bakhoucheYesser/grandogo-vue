<template>
  <!-- Use the computed layout component dynamically -->
  <component :is="layout">
    <router-view />
  </component>
  <!-- Add ToastContainer here, outside of layouts so it's always visible -->
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
  MainLayout: markRaw(MainLayout), // Add MainLayout support
}

const authStore = useAuthStore()

// Create a type that represents the keys of the layouts object
type LayoutName = keyof typeof layouts

// Determine layout based on route metadata
const layout = computed(() => {
  // Get the layout name from route metadata, default to MainLayout
  const layoutName = (route.meta.layout as string) || 'MainLayout'

  console.log(`🎨 Current route: ${route.path}`)
  console.log(`🎨 Layout requested: ${layoutName}`)

  // Check if the layoutName is a valid key in layouts
  if (layoutName in layouts) {
    return layouts[layoutName as LayoutName]
  }

  // Fallback to MainLayout (navbar + footer, no sidebar)
  console.log('🎨 Using fallback MainLayout')
  return layouts.MainLayout
})
</script>
