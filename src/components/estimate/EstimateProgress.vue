<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-gray-900">Estimate Progress</h3>
      <span class="text-sm text-gray-500">{{ progress }}%</span>
    </div>

    <div class="w-full bg-gray-200 rounded-full h-2">
      <div
        class="bg-red-600 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <div class="flex justify-between mt-3 text-xs text-gray-500">
      <span :class="{ 'text-red-600 font-medium': progress >= 25 }">Pickup</span>
      <span :class="{ 'text-red-600 font-medium': progress >= 50 }">Destination</span>
      <span :class="{ 'text-red-600 font-medium': progress >= 75 }">Vehicle</span>
      <span :class="{ 'text-red-600 font-medium': progress >= 100 }">Price</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress: number;
}

defineProps<Props>();
</script>
