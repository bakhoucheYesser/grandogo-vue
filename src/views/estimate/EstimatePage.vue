<!-- src/views/estimate/EstimatePage.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content Container -->
    <div class="relative">
      <!-- Hero Section with Map Background -->
      <div class="relative h-screen bg-cover bg-center" style="background-image: url('/api/placeholder/1200/800');">
        <!-- Map Container (will be replaced with actual map) -->
        <div ref="mapContainer" class="absolute inset-0">
          <HereMap
            ref="mapRef"
            :pickup="selectedPickup"
            :destination="selectedDestination"
            :api-key="hereApiKey"
            class="w-full h-full"
          />
        </div>

        <!-- Overlay Content -->
        <div class="absolute inset-0 bg-black bg-opacity-20">
          <div class="container mx-auto px-4 py-8 h-full flex flex-col justify-center">

            <!-- Title -->
            <div class="text-center mb-8">
              <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                Get an estimate
              </h1>
              <p class="text-lg text-white opacity-90">
                Enter your addresses to see your prices and schedule your Lugg
              </p>
            </div>

            <!-- Address Input Form -->
            <div class="max-w-4xl mx-auto w-full">
              <div class="bg-white rounded-xl shadow-lg p-2 flex items-center gap-2">
                <!-- Pickup Address -->
                <div class="flex-1 relative">
                  <div class="flex items-center px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"></path>
                    </svg>
                    <div class="flex-1">
                      <div class="text-xs text-gray-500 mb-1">Pick up from</div>
                      <AddressAutocomplete
                        ref="pickupRef"
                        v-model="pickupAddress"
                        type="pickup"
                        placeholder="Pickup address"
                        :user-location="userLocation"
                        class="w-full"
                        @address-selected="handlePickupSelected"
                      />
                    </div>
                  </div>
                </div>

                <!-- Divider -->
                <div class="w-px h-12 bg-gray-200"></div>

                <!-- Destination Address -->
                <div class="flex-1 relative">
                  <div class="flex items-center px-4 py-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="flex-1">
                      <div class="text-xs text-gray-500 mb-1">Move to</div>
                      <AddressAutocomplete
                        ref="destinationRef"
                        v-model="destinationAddress"
                        type="destination"
                        placeholder="Drop-off address"
                        :user-location="userLocation"
                        class="w-full"
                        @address-selected="handleDestinationSelected"
                      />
                    </div>
                  </div>
                </div>

                <!-- See Prices Button -->
                <button
                  @click="scrollToVehicles"
                  :disabled="!canCalculatePrice"
                  class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg v-if="isCalculatingRoute" class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-else>See prices</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Map markers overlay (when addresses are selected) -->
        <div v-if="selectedPickup" class="absolute" :style="getMarkerPosition('pickup')">
          <div class="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Pickup
          </div>
        </div>
        <div v-if="selectedDestination" class="absolute" :style="getMarkerPosition('destination')">
          <div class="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Drop-off
          </div>
        </div>
      </div>

      <!-- Vehicle Selection Section -->
      <div v-if="canCalculatePrice" ref="vehicleSection" class="py-16 bg-white">
        <div class="container mx-auto px-4">

          <!-- Vehicle Options Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

            <!-- Pickup Vehicle -->
            <VehicleCard
              :vehicle="vehicles.pickup"
              :route-info="routeInfo"
              :selected="selectedVehicle?.type === 'pickup'"
              @select="selectVehicle(vehicles.pickup)"
            />

            <!-- Van Vehicle -->
            <VehicleCard
              :vehicle="vehicles.van"
              :route-info="routeInfo"
              :selected="selectedVehicle?.type === 'van'"
              @select="selectVehicle(vehicles.van)"
            />

            <!-- XL Vehicle -->
            <VehicleCard
              :vehicle="vehicles.xl"
              :route-info="routeInfo"
              :selected="selectedVehicle?.type === 'xl'"
              @select="selectVehicle(vehicles.xl)"
            />

            <!-- Box Vehicle -->
            <VehicleCard
              :vehicle="vehicles.box"
              :route-info="routeInfo"
              :selected="selectedVehicle?.type === 'box'"
              @select="selectVehicle(vehicles.box)"
            />
          </div>

          <!-- Save Option -->
          <div v-if="selectedVehicle && selectedVehicle.type !== 'pickup'" class="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-blue-900 mb-2">Save 35% — Get 1 Lugger</h3>
                <p class="text-blue-700">Get a single Lugger. Be ready to help if it's too heavy.</p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-blue-600">${{ getSingleLuggerPrice() }}</div>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold mt-2">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Breakdown Section -->
      <div v-if="selectedVehicle && routeInfo" class="py-12 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="max-w-2xl mx-auto">

            <!-- Time Estimate Slider -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-600">Few Items</span>
                </div>
                <div class="flex-1 mx-8">
                  <div class="relative">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-orange-500 h-2 rounded-full" style="width: 25%"></div>
                    </div>
                    <div class="absolute -top-1 bg-orange-500 w-4 h-4 rounded-full" style="left: 25%; transform: translateX(-50%)"></div>
                  </div>
                </div>
                <div class="text-sm text-gray-600">Avg. 2 BR</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900 mb-1">{{ estimatedTime }} min</div>
                <div class="text-gray-600">Estimated time to load and unload your items.</div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">Price Breakdown</h3>

              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Base fare ({{ selectedVehicle.name }})</span>
                  <span class="font-semibold">${{ selectedVehicle.basePrice.toFixed(2) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Traveled miles ({{ formatDistance(routeInfo.summary.length) }})</span>
                  <span class="font-semibold">${{ getMileageCost().toFixed(2) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Labor fee ({{ estimatedTime }} mins)</span>
                  <span class="font-semibold">${{ getLaborCost().toFixed(2) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Booking Fee</span>
                  <span class="font-semibold">${{ getBookingFee().toFixed(2) }}</span>
                </div>

                <div class="border-t pt-4">
                  <div class="flex justify-between text-lg font-bold">
                    <span>Total price (estimated)</span>
                    <span class="text-2xl">${{ getTotalPrice().toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <!-- Important Notice -->
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <div class="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p class="text-sm text-yellow-800 font-medium">This is only an estimate.</p>
                    <p class="text-sm text-yellow-700">Final price may be higher based on actual labor time.</p>
                  </div>
                </div>
              </div>

              <!-- Continue Button -->
              <button
                @click="proceedToBooking"
                class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-lg mt-6 transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Information Section -->
      <div class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">For all moves, big or small</h2>
          </div>

          <div class="space-y-12">
            <!-- Lite Option -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  Lite <span class="text-lg text-blue-600 font-normal">1 Lugger</span>
                </h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Great for small, lightweight moves. Ideal for moving a few boxes, compact furniture, or when you only need one mover.
                </p>
              </div>
              <div class="flex-shrink-0 ml-8">
                <img src="/images/illustrations/pickup_truck.svg" alt="Lite vehicle" class="w-32 h-20 object-contain" />
              </div>
            </div>

            <!-- Pickup Option -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  Pickup <span class="text-lg text-blue-600 font-normal">2 Luggers</span>
                </h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Great for a few medium-sized items or a small number of larger pieces. Good fit for a couch, an appliance, or several large boxes.
                </p>
              </div>
              <div class="flex-shrink-0 ml-8">
                <img src="/images/illustrations/pickup_truck.svg" alt="Pickup vehicle" class="w-32 h-20 object-contain" />
              </div>
            </div>

            <!-- Van Option -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  Van <span class="text-lg text-blue-600 font-normal">2 Luggers</span>
                </h3>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Great for medium to large moves. Perfect for moving multiple furniture pieces such as a living room or bedroom set.
                </p>
              </div>
              <div class="flex-shrink-0 ml-8">
                <img src="/images/illustrations/van_truck.svg" alt="Van vehicle" class="w-32 h-20 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AddressAutocomplete from './components/AddressAutocomplete.vue';
import HereMap from './components/HereMap.vue';
import VehicleCard from './components/VehicleCard.vue';
import autocompleteService from '@/services/autocomplete.service';
import toastService from '@/services/toast.service';
import type { PlaceResult, RouteResult, Location } from '@/types/address.types';

// Router
const route = useRoute();
const router = useRouter();

// Refs
const pickupRef = ref<InstanceType<typeof AddressAutocomplete> | null>(null);
const destinationRef = ref<InstanceType<typeof AddressAutocomplete> | null>(null);
const mapRef = ref<InstanceType<typeof HereMap> | null>(null);
const mapContainer = ref<HTMLElement | null>(null);
const vehicleSection = ref<HTMLElement | null>(null);

// Reactive state
const pickupAddress = ref('');
const destinationAddress = ref('');
const selectedPickup = ref<Location | null>(null);
const selectedDestination = ref<Location | null>(null);
const selectedVehicle = ref<any>(null);
const userLocation = ref<{ lat: number; lng: number } | null>(null);
const routeInfo = ref<RouteResult | null>(null);
const isCalculatingRoute = ref(false);
const estimatedTime = ref(30);

// Environment variables
const hereApiKey = import.meta.env.VITE_HERE_MAPS_API_KEY;

// Vehicle definitions
const vehicles = ref({
  pickup: {
    type: 'pickup',
    name: 'Pickup',
    description: '2 Luggers',
    basePrice: 38.00,
    perMinute: 1.62,
    perMile: 2.24,
    image: '/images/illustrations/pickup_truck.svg'
  },
  van: {
    type: 'van',
    name: 'Van',
    description: '2 Luggers',
    basePrice: 50.00,
    perMinute: 1.62,
    perMile: 2.24,
    image: '/images/illustrations/van_truck.svg'
  },
  xl: {
    type: 'xl',
    name: 'XL',
    description: '2 Luggers',
    basePrice: 65.00,
    perMinute: 1.62,
    perMile: 2.24,
    image: '/images/illustrations/xl_truck.svg'
  },
  box: {
    type: 'box',
    name: 'Box',
    description: '2 Luggers',
    basePrice: 85.00,
    perMinute: 1.62,
    perMile: 2.24,
    image: '/images/illustrations/box_truck.svg'
  }
});

// Computed
const canCalculatePrice = computed(() => {
  return selectedPickup.value && selectedDestination.value;
});

// Lifecycle
onMounted(() => {
  initializeFromQuery();
  getCurrentLocation();
});

// Watch for address changes
watch([selectedPickup, selectedDestination], () => {
  if (selectedPickup.value && selectedDestination.value) {
    calculateRoute();
  } else {
    routeInfo.value = null;
  }
}, { deep: true });

// Methods
const initializeFromQuery = () => {
  if (route.query.pickup && typeof route.query.pickup === 'string') {
    pickupAddress.value = route.query.pickup;
  }
  if (route.query.dropoff && typeof route.query.dropoff === 'string') {
    destinationAddress.value = route.query.dropoff;
  }
};

const getCurrentLocation = async () => {
  if (userLocation.value) return;

  try {
    const location = await autocompleteService.getCurrentLocation();
    if (location) {
      userLocation.value = location;
    }
  } catch (error) {
    console.warn('Failed to get user location:', error);
  }
};

const handlePickupSelected = (address: PlaceResult) => {
  selectedPickup.value = {
    lat: address.position.lat,
    lng: address.position.lng,
    address: address.address.label
  };
};

const handleDestinationSelected = (address: PlaceResult) => {
  selectedDestination.value = {
    lat: address.position.lat,
    lng: address.position.lng,
    address: address.address.label
  };
};

const calculateRoute = async () => {
  if (!selectedPickup.value || !selectedDestination.value || isCalculatingRoute.value) return;

  try {
    isCalculatingRoute.value = true;

    const route = await autocompleteService.calculateRoute(
      selectedPickup.value,
      selectedDestination.value
    );

    if (route) {
      routeInfo.value = route;
    }
  } catch (error) {
    console.error('Route calculation failed:', error);
    toastService.error('Failed to calculate route');
  } finally {
    isCalculatingRoute.value = false;
  }
};

const scrollToVehicles = () => {
  if (!canCalculatePrice.value) {
    toastService.warning('Please enter both pickup and destination addresses');
    return;
  }

  nextTick(() => {
    vehicleSection.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
};

const selectVehicle = (vehicle: any) => {
  selectedVehicle.value = vehicle;
};

const getMarkerPosition = (type: 'pickup' | 'destination') => {
  // This would calculate the actual position based on map coordinates
  // For now, return approximate positions
  if (type === 'pickup') {
    return { top: '40%', left: '20%' };
  } else {
    return { top: '60%', right: '20%' };
  }
};

const getSingleLuggerPrice = () => {
  if (!selectedVehicle.value || !routeInfo.value) return '0';
  const total = getTotalPrice();
  return Math.ceil(total * 0.65).toFixed(2);
};

const getMileageCost = () => {
  if (!selectedVehicle.value || !routeInfo.value) return 0;
  const miles = routeInfo.value.summary.length * 0.000621371; // Convert meters to miles
  return miles * selectedVehicle.value.perMile;
};

const getLaborCost = () => {
  if (!selectedVehicle.value) return 0;
  return estimatedTime.value * selectedVehicle.value.perMinute;
};

const getBookingFee = () => {
  if (!selectedVehicle.value || !routeInfo.value) return 0;
  const subtotal = selectedVehicle.value.basePrice + getMileageCost() + getLaborCost();
  return subtotal * 0.06; // 6% booking fee
};

const getTotalPrice = () => {
  if (!selectedVehicle.value || !routeInfo.value) return 0;
  return selectedVehicle.value.basePrice + getMileageCost() + getLaborCost() + getBookingFee();
};

const formatDistance = (meters: number): string => {
  return autocompleteService.formatDistance(meters);
};

const proceedToBooking = () => {
  toastService.success('Booking feature coming soon!');
};
</script>

<style scoped>
/* Custom styles for the Lugg-style estimate page */
.vehicle-section {
  scroll-margin-top: 2rem;
}

/* Ensure the map takes full height */
.map-container {
  position: relative;
  overflow: hidden;
}

/* Address input styling */
:deep(.address-input) {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  font-weight: 500;
}

:deep(.address-input::placeholder) {
  color: #9CA3AF;
  font-weight: normal;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-content {
    padding: 2rem 1rem;
  }

  .address-form {
    flex-direction: column;
    gap: 1rem;
  }

  .address-form .divider {
    display: none;
  }
}
</style>
