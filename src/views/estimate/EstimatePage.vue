<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Get an estimate</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your addresses to see your prices and schedule your Lugg
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative">
      <!-- Background Map -->
      <div class="absolute inset-0 h-screen">
        <div
          ref="mapContainer"
          class="w-full h-full bg-gray-200"
        >
          <!-- Map Loading State -->
          <div
            v-if="!mapInitialized"
            class="absolute inset-0 flex items-center justify-center bg-gray-200"
          >
            <div class="text-center">
              <div class="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div class="text-gray-600">Loading map...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overlay Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <!-- Address Input Bar -->
        <div class="max-w-4xl mx-auto mb-8">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-2">
            <div class="flex items-center">
              <!-- Pickup Input -->
              <div class="flex-1 px-4 py-3 relative">
                <div class="flex items-center mb-1">
                  <div class="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                  <span class="text-sm font-medium text-red-600">Pick up from</span>
                </div>
                <input
                  v-model="pickupQuery"
                  @input="searchPickup"
                  @focus="showPickupResults = true"
                  @blur="hidePickupResults"
                  type="text"
                  placeholder="Pickup address"
                  class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                />

                <!-- Pickup Dropdown -->
                <div
                  v-if="showPickupResults && pickupResults.length > 0"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                >
                  <button
                    v-for="result in pickupResults"
                    :key="result.id"
                    @mousedown="selectPickup(result)"
                    class="w-full px-4 py-3 text-left hover:bg-red-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div class="font-medium text-gray-900">{{ result.title }}</div>
                    <div class="text-sm text-gray-500">{{ result.address.label }}</div>
                  </button>
                </div>
              </div>

              <!-- Divider -->
              <div class="w-px h-12 bg-gray-300 mx-2"></div>

              <!-- Dropoff Input -->
              <div class="flex-1 px-4 py-3 relative">
                <div class="flex items-center mb-1">
                  <div class="w-3 h-3 bg-red-900 rounded-full mr-2"></div>
                  <span class="text-sm font-medium text-red-600">Move to</span>
                </div>
                <input
                  v-model="dropoffQuery"
                  @input="searchDropoff"
                  @focus="showDropoffResults = true"
                  @blur="hideDropoffResults"
                  type="text"
                  placeholder="Drop-off address"
                  class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                />

                <!-- Dropoff Dropdown -->
                <div
                  v-if="showDropoffResults && dropoffResults.length > 0"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                >
                  <button
                    v-for="result in dropoffResults"
                    :key="result.id"
                    @mousedown="selectDropoff(result)"
                    class="w-full px-4 py-3 text-left hover:bg-red-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div class="font-medium text-gray-900">{{ result.title }}</div>
                    <div class="text-sm text-gray-500">{{ result.address.label }}</div>
                  </button>
                </div>
              </div>

              <!-- See Prices Button -->
              <div class="ml-2">
                <button
                  @click="showPrices"
                  :disabled="!canShowPrices"
                  class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  See prices
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle Options -->
        <div
          v-if="showVehicleOptions"
          class="fixed left-4 top-1/2 transform -translate-y-1/2 z-20 w-96 space-y-4"
        >
          <div
            v-for="vehicle in vehicles"
            :key="vehicle.id"
            class="bg-white rounded-xl shadow-xl border border-gray-200 p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span class="text-2xl">{{ vehicle.emoji }}</span>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-900">{{ vehicle.name }}</h3>
                  <p class="text-sm text-gray-500">{{ vehicle.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-900">
                  {{ formatPrice(vehicle.price) }}
                </div>
              </div>
            </div>

            <button
              @click="selectVehicle(vehicle)"
              class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Route Info -->
        <div
          v-if="routeInfo"
          class="fixed top-24 right-4 z-20 bg-white rounded-xl shadow-xl border border-gray-200 p-4"
        >
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-red-700 font-medium">{{ routeInfo.distance }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-red-700 font-medium">{{ routeInfo.duration }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useHereMaps } from '@/composables/useHereMaps';
import autocompleteService from '@/services/autocomplete.service';
import toastService from '@/services/toast.service';
import type { PlaceResult } from '@/types/address.types';

// Reactive state
const pickupQuery = ref('');
const dropoffQuery = ref('');
const pickupResults = ref<PlaceResult[]>([]);
const dropoffResults = ref<PlaceResult[]>([]);
const selectedPickup = ref<PlaceResult | null>(null);
const selectedDropoff = ref<PlaceResult | null>(null);
const showPickupResults = ref(false);
const showDropoffResults = ref(false);
const showVehicleOptions = ref(false);
const mapInitialized = ref(false);
const routeInfo = ref<any>(null);

// Vehicle data
const vehicles = ref([
  {
    id: 'pickup',
    name: 'Pickup',
    description: '2 Luggers',
    price: 76.23,
    emoji: '🚛'
  },
  {
    id: 'van',
    name: 'Van',
    description: '2 Luggers',
    price: 126.05,
    emoji: '🚐'
  },
  {
    id: 'xl',
    name: 'XL',
    description: '2 Luggers',
    price: 211.05,
    emoji: '🚚'
  },
  {
    id: 'box',
    name: 'Box',
    description: '2 Luggers',
    price: 230.42,
    emoji: '📦'
  }
]);

// Composables
const { mapContainer, initializeMap, addMarker, drawRoute } = useHereMaps();

// Computed
const canShowPrices = computed(() => selectedPickup.value && selectedDropoff.value);

// Methods
const searchPickup = async () => {
  if (pickupQuery.value.length < 3) return;

  try {
    const results = await autocompleteService.searchPlaces(pickupQuery.value, undefined, 'pickup');
    pickupResults.value = results;
  } catch (error) {
    console.error('Pickup search error:', error);
  }
};

const searchDropoff = async () => {
  if (dropoffQuery.value.length < 3) return;

  try {
    const results = await autocompleteService.searchPlaces(dropoffQuery.value, undefined, 'dropoff');
    dropoffResults.value = results;
  } catch (error) {
    console.error('Dropoff search error:', error);
  }
};

const selectPickup = (place: PlaceResult) => {
  selectedPickup.value = place;
  pickupQuery.value = place.address.label;
  showPickupResults.value = false;

  addMarker(place.position, 'pickup');
  checkRoute();
};

const selectDropoff = (place: PlaceResult) => {
  selectedDropoff.value = place;
  dropoffQuery.value = place.address.label;
  showDropoffResults.value = false;

  addMarker(place.position, 'destination');
  checkRoute();
};

const checkRoute = async () => {
  if (!selectedPickup.value || !selectedDropoff.value) return;

  try {
    const route = await autocompleteService.calculateRoute(
      selectedPickup.value.position,
      selectedDropoff.value.position
    );

    if (route) {
      routeInfo.value = {
        distance: autocompleteService.formatDistance(route.summary.length),
        duration: autocompleteService.formatDuration(route.summary.duration)
      };

      // Draw route on map
      const pickupCoords = `${selectedPickup.value.position.lat},${selectedPickup.value.position.lng}`;
      const dropoffCoords = `${selectedDropoff.value.position.lat},${selectedDropoff.value.position.lng}`;
      await drawRoute(pickupCoords, dropoffCoords);
    }
  } catch (error) {
    console.error('Route calculation error:', error);
  }
};

const showPrices = () => {
  if (canShowPrices.value) {
    showVehicleOptions.value = true;
    toastService.success('Vehicle options displayed!');
  }
};

const selectVehicle = (vehicle: any) => {
  toastService.success(`${vehicle.name} selected!`);
};

const hidePickupResults = () => {
  setTimeout(() => showPickupResults.value = false, 200);
};

const hideDropoffResults = () => {
  setTimeout(() => showDropoffResults.value = false, 200);
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(price);
};

// Lifecycle
onMounted(async () => {
  try {
    // Check if HERE is available
    if (typeof window.H === 'undefined') {
      console.error('HERE Maps SDK not loaded. Please check your internet connection.');
      toastService.error('Map loading failed. Please refresh the page.');
      return;
    }

    const apiKey = import.meta.env.VITE_HERE_API_KEY;
    if (!apiKey) {
      console.error('HERE API key not found');
      toastService.error('Map configuration error');
      return;
    }

    await initializeMap(apiKey);
    mapInitialized.value = true;
    toastService.success('Map loaded successfully!');

  } catch (error) {
    console.error('Map initialization error:', error);
    toastService.error('Failed to initialize map');
  }
});
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 768px) {
  .fixed.left-4 {
    position: fixed;
    left: 1rem;
    right: 1rem;
    width: auto;
    top: auto;
    bottom: 1rem;
    transform: none;
  }
}
</style>
