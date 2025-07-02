<!-- src/views/estimate/components/HereMap.vue -->
<template>
  <div ref="mapContainer" class="w-full h-full bg-gray-200 relative">
    <!-- Map will be initialized here -->
    <div v-if="!mapInitialized && !mapError" class="w-full h-full flex items-center justify-center bg-gray-300">
      <div class="text-center p-8">
        <div class="animate-spin h-8 w-8 mx-auto mb-4 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div class="text-lg font-semibold text-gray-700 mb-2">Loading Map...</div>
        <div class="text-sm text-gray-500">Initializing HERE Maps</div>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="mapError" class="w-full h-full flex items-center justify-center bg-gray-300">
      <div class="text-center p-8">
        <div class="text-4xl mb-4">🗺️</div>
        <div class="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</div>
        <div class="text-sm text-gray-500 mb-4">{{ mapError }}</div>
        <button
          @click="retryMapInitialization"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Fallback static map placeholder -->
    <div v-if="showFallback" class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
      <div class="text-center p-8">
        <div class="text-6xl mb-4">🗺️</div>
        <div class="text-xl font-semibold text-gray-700 mb-2">Interactive Map</div>
        <div class="text-sm text-gray-600 mb-4">Your route will be displayed here</div>
        <div v-if="pickup && destination" class="text-xs text-gray-500">
          <div>📍 {{ pickup.address || 'Pickup location' }}</div>
          <div class="my-2">⬇️</div>
          <div>🎯 {{ destination.address || 'Destination' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
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

// Reactive state
const mapContainer = ref<HTMLElement | null>(null);
const mapInitialized = ref(false);
const mapError = ref<string | null>(null);
const showFallback = ref(false);
const map = ref<any>(null);
const platform = ref<any>(null);

// Watch for pickup changes
watch(
  () => props.pickup,
  (newPickup) => {
    if (newPickup && mapInitialized.value && map.value) {
      addMarker(newPickup, 'pickup');
      updateRoute();
    }
  }
);

// Watch for destination changes
watch(
  () => props.destination,
  (newDestination) => {
    if (newDestination && mapInitialized.value && map.value) {
      addMarker(newDestination, 'destination');
      updateRoute();
    }
  }
);

// Methods
const checkHereSDK = (): boolean => {
  return typeof window !== 'undefined' &&
    typeof (window as any).H !== 'undefined' &&
    typeof (window as any).H.service !== 'undefined' &&
    typeof (window as any).H.Map !== 'undefined';
};

const waitForHereSDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (checkHereSDK()) {
      console.log('✅ HERE Maps SDK already loaded');
      resolve(true);
      return;
    }

    console.log('⏳ Waiting for HERE Maps SDK to load...');
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds total

    const checkInterval = setInterval(() => {
      attempts++;

      if (checkHereSDK()) {
        console.log('✅ HERE Maps SDK loaded successfully');
        clearInterval(checkInterval);
        resolve(true);
      } else if (attempts >= maxAttempts) {
        console.error('❌ HERE Maps SDK failed to load after 10 seconds');
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

const initializeMap = async () => {
  try {
    console.log('🗺️ Starting map initialization...');

    if (!props.apiKey) {
      throw new Error('HERE Maps API key is required');
    }

    // Wait for DOM element
    await nextTick();

    if (!mapContainer.value) {
      throw new Error('Map container element not found');
    }

    console.log('📦 Map container found');

    // Wait for HERE SDK
    const sdkLoaded = await waitForHereSDK();
    if (!sdkLoaded) {
      throw new Error('HERE Maps SDK failed to load');
    }

    // Initialize HERE platform
    console.log('🚀 Initializing HERE platform...');
    platform.value = new (window as any).H.service.Platform({
      'apikey': props.apiKey
    });

    // Get default layers
    const defaultLayers = platform.value.createDefaultLayers();
    console.log('🗂️ Default layers created');

    // Initialize map
    console.log('🗺️ Creating map instance...');
    map.value = new (window as any).H.Map(
      mapContainer.value,
      defaultLayers.vector.normal.map,
      {
        zoom: 10,
        center: { lat: 45.5017, lng: -73.5673 } // Montreal default
      }
    );

    // Enable map interaction
    new (window as any).H.mapevents.Behavior();
    new (window as any).H.ui.UI.createDefault(map.value);

    console.log('✅ Map interactions enabled');

    mapInitialized.value = true;
    mapError.value = null;
    showFallback.value = false;

    // Add existing markers if available
    if (props.pickup) {
      addMarker(props.pickup, 'pickup');
    }
    if (props.destination) {
      addMarker(props.destination, 'destination');
    }
    if (props.pickup && props.destination) {
      updateRoute();
    }

    console.log('🎉 HERE Maps initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing HERE Maps:', error);
    mapError.value = error instanceof Error ? error.message : 'Failed to initialize map';
    mapInitialized.value = false;

    // Show fallback after 2 seconds
    setTimeout(() => {
      showFallback.value = true;
    }, 2000);
  }
};

const addMarker = (location: Location, type: 'pickup' | 'destination') => {
  if (!map.value || !mapInitialized.value) {
    console.warn('Map not initialized, cannot add marker');
    return;
  }

  try {
    const color = type === 'pickup' ? '#dc2626' : '#059669';
    const symbol = type === 'pickup' ? 'P' : 'D';

    // Create custom marker SVG
    const svgMarkup = `
      <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${type}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        <path d="M16 0C7.164 0 0 7.164 0 16c0 16 16 24 16 24s16-8 16-24C32 7.164 24.836 0 16 0z"
              fill="${color}" filter="url(#shadow-${type})"/>
        <circle cx="16" cy="16" r="10" fill="white"/>
        <text x="16" y="20" text-anchor="middle" fill="${color}"
              font-size="12" font-weight="bold" font-family="Arial, sans-serif">
          ${symbol}
        </text>
      </svg>
    `;

    const icon = new (window as any).H.map.Icon(
      `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`,
      { size: { w: 32, h: 40 }, anchor: { x: 16, y: 40 } }
    );

    const marker = new (window as any).H.map.Marker(location, { icon });
    map.value.addObject(marker);

    console.log(`✅ ${type} marker added at:`, location);
  } catch (error) {
    console.error('❌ Error adding marker:', error);
  }
};

const updateRoute = () => {
  if (!map.value || !props.pickup || !props.destination) return;

  try {
    // Clear existing route
    clearMap();

    // Re-add markers
    addMarker(props.pickup, 'pickup');
    addMarker(props.destination, 'destination');

    // Draw simple line between points
    const lineString = new (window as any).H.geo.LineString();
    lineString.pushPoint({ lat: props.pickup.lat, lng: props.pickup.lng });
    lineString.pushPoint({ lat: props.destination.lat, lng: props.destination.lng });

    const routeLine = new (window as any).H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: '#3b82f6',
        lineDash: [4, 4],
        opacity: 0.8
      }
    });

    map.value.addObject(routeLine);

    // Fit map to show both points
    fitToCoordinates([props.pickup, props.destination]);

    console.log('✅ Route updated successfully');
  } catch (error) {
    console.error('❌ Error updating route:', error);
  }
};

const clearMap = () => {
  if (!map.value) return;

  try {
    map.value.removeObjects(map.value.getObjects());
    console.log('🧹 Map cleared');
  } catch (error) {
    console.error('❌ Error clearing map:', error);
  }
};

const fitToCoordinates = (coordinates: Location[]) => {
  if (!map.value || coordinates.length === 0) return;

  try {
    const group = new (window as any).H.map.Group();
    coordinates.forEach(coord => {
      group.addObject(new (window as any).H.map.Marker(coord));
    });

    map.value.getViewModel().setLookAtData({
      bounds: group.getBoundingBox(),
      padding: { top: 50, right: 50, bottom: 50, left: 50 }
    });
  } catch (error) {
    console.error('❌ Error fitting to coordinates:', error);
  }
};

const retryMapInitialization = () => {
  mapError.value = null;
  showFallback.value = false;
  mapInitialized.value = false;
  initializeMap();
};

onMounted(() => {
  if (props.apiKey) {
    initializeMap();
  } else {
    console.warn('HERE Maps API key not provided, showing fallback');
    showFallback.value = true;
  }
});

onUnmounted(() => {
  if (map.value) {
    map.value.dispose?.();
  }
});

// Expose methods if needed
defineExpose({
  clearMap,
  addMarker,
  retryMapInitialization
});
</script>

<style scoped>
/* Map specific styles */
.map-container {
  position: relative;
  overflow: hidden;
}

/* Ensure HERE Maps elements are styled correctly */
:deep(.H_Map) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.H_Map canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
