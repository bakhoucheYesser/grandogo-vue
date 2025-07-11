<template>
  <div ref="mapContainer" class="w-full h-full bg-gray-100 relative overflow-hidden">
    <!-- Loading State -->
    <div v-if="!mapInitialized && !mapError && !showFallback"
         class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 z-10">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
        <div class="text-sm font-medium text-gray-600">Loading Map...</div>
        <div class="text-xs text-gray-500 mt-2">{{ loadingStatus }}</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="mapError && !showFallback"
         class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 z-10">
      <div class="text-center p-6">
        <div class="text-4xl mb-3">⚠️</div>
        <div class="text-sm font-medium text-gray-700 mb-2">Map Error</div>
        <div class="text-xs text-gray-500 mb-4 max-w-xs">{{ mapError }}</div>
        <button
          @click="showFallback = true"
          class="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors mr-2"
        >
          Use Fallback
        </button>
        <button
          @click="retryInitialization"
          class="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Fallback Map avec Markers Visuels -->
    <div v-if="showFallback"
         class="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 overflow-hidden">

      <!-- Grille de fond simulant une carte -->
      <div class="absolute inset-0 opacity-20">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#94a3b8" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          <!-- Routes simulées -->
          <path d="M10,20 Q30,40 50,30 T90,45" stroke="#6b7280" stroke-width="1" fill="none"/>
          <path d="M20,60 Q40,40 60,50 T85,35" stroke="#6b7280" stroke-width="0.8" fill="none"/>
          <path d="M15,80 Q35,60 55,70 T80,65" stroke="#6b7280" stroke-width="0.6" fill="none"/>
        </svg>
      </div>

      <!-- Contenu de la carte fallback -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center p-8 bg-white/30 backdrop-blur-sm rounded-2xl max-w-md">
          <div class="text-5xl mb-4 animate-pulse">🗺️</div>
          <div class="text-xl font-bold text-gray-800 mb-2">Interactive Map</div>
          <div class="text-sm text-gray-600 mb-6">Map in fallback mode - Your locations are shown below</div>

          <!-- Affichage des locations avec markers visuels -->
          <div v-if="pickup || destination" class="space-y-4">
            <!-- Pickup -->
            <div v-if="pickup" class="flex items-center justify-center space-x-3 bg-white/60 rounded-lg p-3">
              <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                P
              </div>
              <div class="text-left">
                <div class="text-sm font-semibold text-gray-800">Pickup</div>
                <div class="text-xs text-gray-600">{{ getLocationName(pickup) }}</div>
              </div>
            </div>

            <!-- Route Arrow -->
            <div v-if="pickup && destination" class="flex justify-center">
              <svg class="w-6 h-6 text-gray-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>

            <!-- Destination -->
            <div v-if="destination" class="flex items-center justify-center space-x-3 bg-white/60 rounded-lg p-3">
              <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                D
              </div>
              <div class="text-left">
                <div class="text-sm font-semibold text-gray-800">Destination</div>
                <div class="text-xs text-gray-600">{{ getLocationName(destination) }}</div>
              </div>
            </div>

            <!-- Distance Info -->
            <div v-if="routeDistance" class="mt-4 p-3 bg-blue-500/20 rounded-lg">
              <div class="text-sm font-semibold text-gray-800">
                Distance: {{ routeDistance }}
              </div>
              <div class="text-xs text-gray-600">Estimated route</div>
            </div>
          </div>

          <!-- Fallback Controls -->
          <div class="mt-6 space-y-2">
            <div class="text-xs text-gray-500">Map fallback mode active</div>
            <button
              @click="retryMapInitialization"
              class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Try Real Map
            </button>
          </div>
        </div>
      </div>

      <!-- Animated markers on fallback map -->
      <div v-if="pickup"
           class="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
          P
        </div>
        <div class="w-3 h-3 bg-red-500 rounded-full mx-auto mt-1"></div>
      </div>

      <div v-if="destination"
           class="absolute top-2/3 right-1/3 transform translate-x-1/2 -translate-y-1/2 z-20">
        <div class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
          D
        </div>
        <div class="w-3 h-3 bg-gray-700 rounded-full mx-auto mt-1"></div>
      </div>

      <!-- Route line on fallback -->
      <div v-if="pickup && destination" class="absolute inset-0 pointer-events-none z-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M33,33 Q50,20 67,67" stroke="#ef4444" stroke-width="0.5" fill="none"
                stroke-dasharray="2,1" class="animate-pulse"/>
        </svg>
      </div>
    </div>

    <!-- Map Success State -->
    <div v-if="mapInitialized && !mapError && !showFallback"
         class="absolute inset-0 pointer-events-none z-5">
      <!-- Gradient overlay minimal pour la lisibilité -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5"></div>

      <!-- Debug Info (développement seulement) -->
      <div v-if="debugMode" class="absolute top-4 left-4 bg-black/70 text-white p-2 rounded text-xs z-30">
        <div>Markers: {{ pickupMarker ? 'P' : '' }}{{ destinationMarker ? 'D' : '' }}</div>
        <div>Zoom: {{ currentZoom }}</div>
        <div>Center: {{ currentCenter?.lat?.toFixed(3) }}, {{ currentCenter?.lng?.toFixed(3) }}</div>
      </div>
    </div>

    <!-- Manual Center Button -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import type { Location } from '@/types/address.types';

interface Props {
  pickup?: Location | null;
  destination?: Location | null;
  apiKey?: string;
  userLocation?: { lat: number; lng: number } | null;
}

const props = withDefaults(defineProps<Props>(), {
  pickup: null,
  destination: null,
  apiKey: '',
  userLocation: null
});

// Reactive state
const mapContainer = ref<HTMLElement | null>(null);
const map = ref<any>(null);
const platform = ref<any>(null);
const mapInitialized = ref(false);
const mapError = ref<string | null>(null);
const showFallback = ref(false);
const loadingStatus = ref('Initializing...');
const debugMode = ref(false);

// Map state tracking
const currentZoom = ref(10);
const currentCenter = ref<{ lat: number; lng: number } | null>(null);

// Markers
const pickupMarker = ref<any>(null);
const destinationMarker = ref<any>(null);
const routeLine = ref<any>(null);

// Computed
const routeDistance = computed(() => {
  if (!props.pickup || !props.destination) return null;

  const R = 6371;
  const dLat = (props.destination.lat - props.pickup.lat) * Math.PI / 180;
  const dLng = (props.destination.lng - props.pickup.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(props.pickup.lat * Math.PI / 180) * Math.cos(props.destination.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
});


function sanitizeLocation(location: any) {
  return {
    lat: location?.lat,
    lng: location?.lng
  };
}
// Watch for pickup changes
watch(
  () => props.pickup,
  (newPickup, oldPickup) => {
    if (newPickup && mapInitialized.value) {
      console.log('🔄 Pickup changed, adding marker:', newPickup);
      addPickupMarker(newPickup);

      // If we also have destination, update route and center
      if (props.destination) {
        setTimeout(() => {
          updateRoute();
          setTimeout(() => {
            centerMapOnMarkers();
          }, 100);
        }, 300);
      }
    } else if (!newPickup && routeLine.value) {
      // Remove route if pickup is cleared
      map.value?.removeObject(routeLine.value);
      routeLine.value = null;
    }
  },
  { deep: true }
);

// Watch for destination changes
watch(
  () => props.destination,
  (newDestination, oldDestination) => {
    if (newDestination && mapInitialized.value) {
      console.log('🔄 Destination changed, adding marker:', newDestination);
      addDestinationMarker(newDestination);

      // If we also have pickup, update route and center
      if (props.pickup) {
        setTimeout(() => {
          updateRoute();
          setTimeout(() => {
            centerMapOnMarkers();
          }, 100);
        }, 300);
      }
    } else if (!newDestination && routeLine.value) {
      // Remove route if destination is cleared
      map.value?.removeObject(routeLine.value);
      routeLine.value = null;
    }
  },
  { deep: true }
);

// Methods
const checkHereSDK = (): boolean => {
  return typeof window !== 'undefined' &&
    typeof (window as any).H !== 'undefined' &&
    typeof (window as any).H.service !== 'undefined' &&
    typeof (window as any).H.Map !== 'undefined';
};

const waitForHereSDK = (timeout = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (checkHereSDK()) {
      resolve(true);
      return;
    }

    loadingStatus.value = 'Loading HERE SDK...';
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (checkHereSDK()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

const initializeMap = async () => {
  try {
    console.log('🗺️ Starting HERE Maps initialization...');

    if (!props.apiKey) {
      console.warn('⚠️ No HERE Maps API key provided');
      showFallback.value = true;
      return;
    }

    loadingStatus.value = 'Checking API key...';
    console.log('🔑 API Key (first 10 chars):', props.apiKey.substring(0, 10));

    await nextTick();

    if (!mapContainer.value) {
      throw new Error('Map container element not found');
    }

    console.log('📦 Map container found:', mapContainer.value);

    // Wait for HERE SDK
    loadingStatus.value = 'Loading HERE SDK...';
    const sdkLoaded = await waitForHereSDK();
    if (!sdkLoaded) {
      throw new Error('HERE Maps SDK failed to load');
    }

    console.log('✅ HERE SDK loaded');

    // Initialize platform with validation
    loadingStatus.value = 'Initializing platform...';
    try {
      platform.value = new (window as any).H.service.Platform({
        'apikey': props.apiKey
      });
      console.log('✅ Platform initialized');
    } catch (platformError) {
      console.error('❌ Platform initialization failed:', platformError);
      throw new Error(`Invalid API key or platform error: ${platformError.message}`);
    }

    // Get default layers
    loadingStatus.value = 'Loading map layers...';
    let defaultLayers;
    try {
      defaultLayers = platform.value.createDefaultLayers();
      console.log('✅ Default layers created');
    } catch (layersError) {
      console.error('❌ Layers creation failed:', layersError);
      throw new Error(`Failed to create map layers: ${layersError.message}`);
    }

    // Set center location
    const center = props.userLocation || { lat: 45.5017, lng: -73.5673 };
    console.log('📍 Setting center to:', center);
    currentCenter.value = center;

    // Create map with error handling
    loadingStatus.value = 'Creating map...';
    try {
      map.value = new (window as any).H.Map(
        mapContainer.value,
        defaultLayers.vector.normal.map,
        {
          zoom: props.userLocation ? 12 : 10,
          center: center
        }
      );
      console.log('✅ Map created successfully');
      currentZoom.value = props.userLocation ? 12 : 10;
    } catch (mapError) {
      console.error('❌ Map creation failed:', mapError);
      throw new Error(`Failed to create map instance: ${mapError.message}`);
    }

    // Enable interactions with error handling
    loadingStatus.value = 'Setting up interactions...';
    try {
      const behavior = new (window as any).H.mapevents.Behavior(new (window as any).H.mapevents.MapEvents(map.value));
      console.log('✅ Map interactions enabled');
    } catch (interactionError) {
      console.warn('⚠️ Failed to enable interactions (non-critical):', interactionError);
    }

    // Try to add UI but don't fail if it doesn't work
    try {
      // Check if we have the required layers for UI
      if (defaultLayers && defaultLayers.raster) {
        const ui = (window as any).H.ui.UI.createDefault(map.value);
        console.log('✅ Map UI enabled');
      } else {
        console.log('⚠️ UI skipped - raster layers not available');
      }
    } catch (uiError) {
      console.warn('⚠️ Failed to enable UI (non-critical):', uiError);
    }

    // Listen to map events for state tracking
    if (map.value) {
      map.value.addEventListener('mapviewchange', () => {
        try {
          currentZoom.value = map.value.getZoom();
          currentCenter.value = map.value.getCenter();
        } catch (error) {
          console.warn('Failed to update map state:', error);
        }
      });
    }

    // Apply styling
    setTimeout(() => {
      applyMapStyling();
    }, 1000);

    mapInitialized.value = true;
    mapError.value = null;
    showFallback.value = false;

    // Add existing markers with proper centering
    let hasMarkers = false;
    if (props.pickup) {
      addPickupMarker(props.pickup);
      hasMarkers = true;
    }
    if (props.destination) {
      addDestinationMarker(props.destination);
      hasMarkers = true;
    }

    // Add route if both markers exist
    if (props.pickup && props.destination) {
      setTimeout(() => {
        updateRoute();
        centerMapOnMarkers();
      }, 300);
    } else if (hasMarkers) {
      // Just center on available markers
      setTimeout(() => {
        centerMapOnMarkers();
      }, 300);
    }

    console.log('🎉 HERE Maps initialization complete!');

  } catch (error) {
    console.error('❌ Map initialization failed:', error);
    mapError.value = error instanceof Error ? error.message : 'Failed to initialize map';
    mapInitialized.value = false;

    // Auto-fallback after 3 seconds
    setTimeout(() => {
      if (!mapInitialized.value) {
        showFallback.value = true;
      }
    }, 3000);
  }
};

const applyMapStyling = () => {
  if (!mapContainer.value || !map.value) return;

  try {
    const mapElement = mapContainer.value.querySelector('.H_Map') as HTMLElement;
    if (mapElement) {
      mapElement.style.filter = 'grayscale(20%) contrast(0.95) brightness(1.02)';
      mapElement.style.opacity = '0.95';
    }

    const uiElements = mapContainer.value.querySelectorAll('.H_ui');
    uiElements.forEach(element => {
      (element as HTMLElement).style.opacity = '0.8';
    });

    console.log('🎨 Map styling applied');
  } catch (error) {
    console.warn('⚠️ Failed to apply styling:', error);
  }
};

const createMarkerIcon = (type: 'pickup' | 'destination') => {
  const color = type === 'pickup' ? '#ef4444' : '#374151';
  const symbol = type === 'pickup' ? 'P' : 'D';

  const svgMarkup = `
    <svg width="40" height="48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${type}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <path d="M20 0C8.954 0 0 8.954 0 20c0 20 20 28 20 28s20-8 20-28C40 8.954 31.046 0 20 0z"
            fill="${color}" filter="url(#shadow-${type})"/>
      <circle cx="20" cy="20" r="14" fill="white"/>
      <text x="20" y="26" text-anchor="middle" fill="${color}"
            font-size="16" font-weight="bold" font-family="Arial, sans-serif">
        ${symbol}
      </text>
    </svg>
  `;

  return new (window as any).H.map.Icon(
    `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`,
    { size: { w: 40, h: 48 }, anchor: { x: 20, y: 48 } }
  );
};

const addPickupMarker = (location: Location) => {
  location = sanitizeLocation(location);
  if (!map.value || !mapInitialized.value) {
    console.warn('⚠️ Cannot add pickup marker: map not initialized');
    return;
  }

  try {
    // Remove existing marker
    if (pickupMarker.value) {
      map.value.removeObject(pickupMarker.value);
    }

    const icon = createMarkerIcon('pickup');
    pickupMarker.value = new (window as any).H.map.Marker({ lat: location.lat, lng: location.lng }, { icon });
    map.value.addObject(pickupMarker.value);
    console.log('📍 Pickup marker added at:', location);
  } catch (error) {
    console.error('❌ Error adding pickup marker:', error);
  }
};

const addDestinationMarker = (location: Location) => {
  if (!map.value || !mapInitialized.value) {
    console.warn('⚠️ Cannot add destination marker: map not initialized');
    return;
  }

  try {
    // Remove existing marker
    if (destinationMarker.value) {
      map.value.removeObject(destinationMarker.value);
    }

    const icon = createMarkerIcon('destination');
    destinationMarker.value = new (window as any).H.map.Marker({ lat: location.lat, lng: location.lng }, { icon });
    map.value.addObject(destinationMarker.value);
    console.log('🎯 Destination marker added at:', location);
  } catch (error) {
    console.error('❌ Error adding destination marker:', error);
  }
};

const updateRoute = () => {
  if (!map.value || !props.pickup || !props.destination || !mapInitialized.value) {
    console.log('⚠️ Cannot update route: missing requirements');
    console.log('Map:', !!map.value, 'Pickup:', !!props.pickup, 'Destination:', !!props.destination, 'Initialized:', mapInitialized.value);
    return;
  }

  // Add validation for coordinates
  if (!props.pickup.lat || !props.pickup.lng || !props.destination.lat || !props.destination.lng) {
    console.error('❌ Invalid coordinates:', {
      pickup: { lat: props.pickup.lat, lng: props.pickup.lng },
      destination: { lat: props.destination.lat, lng: props.destination.lng }
    });
    return;
  }

  try {
    // Remove existing route
    if (routeLine.value) {
      map.value.removeObject(routeLine.value);
      routeLine.value = null;
    }

    console.log('🛣️ Creating route between:', {
      pickup: { lat: props.pickup.lat, lng: props.pickup.lng },
      destination: { lat: props.destination.lat, lng: props.destination.lng }
    });

    // Create new route line using correct API
    const lineString = new (window as any).H.geo.LineString();
    const pickup = sanitizeLocation(props.pickup);
    const destination = sanitizeLocation(props.destination);
    // Add the two points using validated coordinates
    lineString.pushPoint(pickup);
    lineString.pushPoint(destination);


    // Create polyline with corrected styling
    routeLine.value = new (window as any).H.map.Polyline(lineString, {
      style: {
        'strokeColor': '#ef4444',
        'lineWidth': 4,
        'lineDash': [8, 4],
        'opacity': 0.8
      }
    });

    // Add to map
    map.value.addObject(routeLine.value);
    console.log('✅ Route created and added to map successfully');

  } catch (error) {
    console.error('❌ Error updating route:', error);
    console.error('Pickup data:', props.pickup);
    console.error('Destination data:', props.destination);
  }
};

const centerMapOnMarkers = () => {
  if (!map.value || !mapInitialized.value) {
    console.warn('⚠️ Cannot center map: map not initialized');
    return;
  }

  try {
    console.log('🎯 Centering map on markers...');

    const locations = [];
    if (props.pickup) locations.push(sanitizeLocation(props.pickup));
    if (props.destination) locations.push(sanitizeLocation(props.destination));

    if (locations.length === 0) {
      console.warn('⚠️ No locations to center on');
      return;
    }

    if (locations.length === 1) {
      // Center on single location using correct API
      const location = locations[0];
      map.value.setCenter({ lat: location.lat, lng: location.lng });
      map.value.setZoom(14);
      console.log('📍 Centered on single location:', location);
    } else {
      // Calculate center manually for multiple locations
      const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

      // Calculate appropriate zoom level based on distance
      const latDiff = Math.abs(locations[0].lat - locations[1].lat);
      const lngDiff = Math.abs(locations[0].lng - locations[1].lng);
      const maxDiff = Math.max(latDiff, lngDiff);

      let zoom = 10;
      if (maxDiff < 0.01) zoom = 14;
      else if (maxDiff < 0.1) zoom = 12;
      else if (maxDiff < 1) zoom = 10;
      else zoom = 8;

      map.value.setCenter({ lat: avgLat, lng: avgLng });
      map.value.setZoom(zoom);

      console.log('✅ Map centered on all markers');
    }

    // Update current state
    setTimeout(() => {
      try {
        currentZoom.value = map.value.getZoom();
        currentCenter.value = map.value.getCenter();
        console.log('📊 Map state updated - Zoom:', currentZoom.value, 'Center:', currentCenter.value);
      } catch (error) {
        console.warn('Failed to update map state after centering:', error);
      }
    }, 500);

  } catch (error) {
    console.error('❌ Error centering map on markers:', error);
  }
};

const clearMap = () => {
  if (!map.value) return;

  try {
    map.value.removeObjects(map.value.getObjects());
    pickupMarker.value = null;
    destinationMarker.value = null;
    routeLine.value = null;
    console.log('🧹 Map cleared');
  } catch (error) {
    console.error('❌ Error clearing map:', error);
  }
};

const retryInitialization = () => {
  mapError.value = null;
  showFallback.value = false;
  mapInitialized.value = false;
  initializeMap();
};

const retryMapInitialization = () => {
  showFallback.value = false;
  initializeMap();
};

// Utility methods for fallback
const getLocationName = (location: Location): string => {
  if (location.address) {
    const parts = location.address.split(',');
    return parts[0]?.trim() || 'Location';
  }
  return 'Location';
};

// Lifecycle
onMounted(() => {
  // Enable debug mode in development
  debugMode.value = import.meta.env.DEV || false;
  initializeMap();
});

onUnmounted(() => {
  if (map.value) {
    try {
      map.value.dispose?.();
    } catch (error) {
      console.warn('Map disposal error:', error);
    }
  }
});

// Expose methods
defineExpose({
  clearMap,
  retryInitialization,
  centerMapOnMarkers
});
</script>

<style scoped>
/* Ensure HERE Maps renders correctly */
:deep(.H_Map) {
  filter: grayscale(20%) contrast(0.95) brightness(1.02);
  transition: filter 0.5s ease;
  width: 100% !important;
  height: 100% !important;
}

:deep(.H_Map canvas) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.H_ui) {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

/* Animations */
.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-15px,0);
  }
  70% {
    transform: translate3d(0,-7px,0);
  }
  90% {
    transform: translate3d(0,-2px,0);
  }
}
</style>
