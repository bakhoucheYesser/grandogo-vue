<!-- src/views/estimate/components/HereMap.vue -->
<template>
  <div ref="mapContainer" class="w-full h-full bg-gray-200" style="min-height: 400px;">
    <!-- Map will be initialized here -->
    <div v-if="!mapInitialized" class="w-full h-full flex items-center justify-center">
      <div class="text-center p-8">
        <div v-if="mapError" class="text-red-600">
          <div class="text-4xl mb-4">⚠️</div>
          <div class="text-lg font-semibold mb-2">Map Error</div>
          <div class="text-sm">{{ mapError }}</div>
        </div>
        <div v-else class="text-gray-600">
          <div class="text-4xl mb-4">🗺️</div>
          <div class="text-lg font-semibold mb-2">Loading Map...</div>
          <div class="text-sm">Initializing HERE Maps</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useHereMaps } from '@/composables/useHereMaps';
import type { Location } from '@/types/address.types';

interface Props {
  pickup?: Location | null;
  destination?: Location | null;
  apiKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  pickup: null,
  destination: null,
  apiKey: ''
});

// Use the HERE Maps composable
const {
  mapContainer,
  mapInitialized,
  mapError,
  initializeMap,
  addMarker,
  drawRoute,
  clearMap,
  fitToCoordinates
} = useHereMaps();

// Watch for pickup changes
watch(
  () => props.pickup,
  (newPickup) => {
    if (newPickup && mapInitialized.value) {
      clearMap();
      addMarker(newPickup, 'pickup');

      if (props.destination) {
        addMarker(props.destination, 'destination');
        drawRoute(
          `${newPickup.lat},${newPickup.lng}`,
          `${props.destination.lat},${props.destination.lng}`
        );
      }
    }
  }
);

// Watch for destination changes
watch(
  () => props.destination,
  (newDestination) => {
    if (newDestination && mapInitialized.value) {
      if (props.pickup) {
        clearMap();
        addMarker(props.pickup, 'pickup');
        addMarker(newDestination, 'destination');
        drawRoute(
          `${props.pickup.lat},${props.pickup.lng}`,
          `${newDestination.lat},${newDestination.lng}`
        );
      } else {
        addMarker(newDestination, 'destination');
      }
    }
  }
);

onMounted(async () => {
  if (props.apiKey) {
    await initializeMap(props.apiKey);
  } else {
    console.warn('HERE Maps API key not provided');
    mapError.value = 'HERE Maps API key not configured';
  }
});

onUnmounted(() => {
  // Cleanup if needed
});

// Expose methods if needed
defineExpose({
  clearMap,
  addMarker,
  drawRoute
});
</script>

<style scoped>
/* Map-specific styles */
.map-container {
  filter: grayscale(100%) contrast(1.3) brightness(0.9);
}
</style>
