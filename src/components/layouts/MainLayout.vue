<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar v-if="!hideNavbar" />

    <!-- Main content -->
    <main class="flex-grow">
      <div class="container mx-auto px-4 py-8">
        <!-- Main content slot -->
        <slot></slot>
      </div>
    </main>

    <!-- Footer -->
    <Footer v-if="!hideFooter" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import Navbar from '../layout/Navbar.vue';
import Footer from '../layout/Footer.vue';
import toastService from '@/services/toast.service';

interface Props {
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

// Define props with default values
const props = defineProps<Props>();

// Expose toast service methods to parent components
defineExpose({
  addSuccess: (message: string) => toastService.success(message),
  addError: (message: string) => toastService.error(message),
  addWarning: (message: string) => toastService.warning(message)
});
</script>
