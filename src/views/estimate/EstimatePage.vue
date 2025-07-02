<!-- src/views/estimate/EstimatePage.vue - VERSION AMÉLIORÉE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content Container -->
    <div class="relative">
      <!-- Hero Section with Map Background -->
      <div class="relative h-screen bg-cover bg-center">
        <!-- Map Container -->
        <div ref="mapContainer" class="absolute inset-0">
          <HereMap
            ref="mapRef"
            :pickup="pickupLocation"
            :destination="destinationLocation"
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
                Enter your addresses to see your prices and schedule your move
              </p>
            </div>

            <!-- Progress Indicator -->
            <div class="max-w-4xl mx-auto w-full mb-4">
              <EstimateProgress :progress="estimateProgress" />
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

                <!-- Action Button -->
                <button
                  v-if="!canCalculateEstimate"
                  @click="scrollToVehicles"
                  :disabled="!pickupLocation || !destinationLocation"
                  class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  See vehicles
                </button>

                <button
                  v-else
                  @click="handleCalculateEstimate"
                  :disabled="isCalculating"
                  class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg v-if="isCalculating" class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-else>Calculate price</span>
                </button>
              </div>

              <!-- Status Message -->
              <div class="text-center mt-4">
                <p class="text-white text-sm">{{ estimateStatusText }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Selection Section -->
      <div v-if="pickupLocation && destinationLocation" ref="vehicleSection" class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Choose your vehicle</h2>
            <p class="text-gray-600">Select the right size for your move</p>
          </div>

          <!-- Vehicle Options Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <VehicleCard
              v-for="vehicle in availableVehicles"
              :key="vehicle.id"
              :vehicle="vehicle"
              :route-info="currentEstimate?.route"
              :selected="selectedVehicle?.id === vehicle.id"
              @select="handleVehicleSelect(vehicle)"
            />
          </div>

          <!-- Loading State -->
          <div v-if="availableVehicles.length === 0" class="text-center py-12">
            <div class="animate-spin h-8 w-8 mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-gray-500">Loading available vehicles...</p>
          </div>
        </div>
      </div>

      <!-- Price Breakdown Section -->
      <div v-if="currentEstimate" class="py-12 bg-gray-50">
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
                      <div class="bg-orange-500 h-2 rounded-full" :style="{ width: `${(estimatedDuration / 120) * 100}%` }"></div>
                    </div>
                    <input
                      v-model="estimatedDuration"
                      type="range"
                      min="15"
                      max="120"
                      step="15"
                      class="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                      @input="handleDurationChange"
                    />
                  </div>
                </div>
                <div class="text-sm text-gray-600">Avg. 2 BR</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900 mb-1">{{ estimatedDuration }} min</div>
                <div class="text-gray-600">Estimated time to load and unload your items.</div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">Price Breakdown</h3>

              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ currentEstimate.pricing.breakdown.basePrice }}</span>
                  <span class="font-semibold">{{ formatPrice(currentEstimate.pricing.basePrice) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">{{ currentEstimate.pricing.breakdown.mileageCost }}</span>
                  <span class="font-semibold">{{ formatPrice(currentEstimate.pricing.mileageCost) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">{{ currentEstimate.pricing.breakdown.laborCost }}</span>
                  <span class="font-semibold">{{ formatPrice(currentEstimate.pricing.laborCost) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">{{ currentEstimate.pricing.breakdown.bookingFee }}</span>
                  <span class="font-semibold">{{ formatPrice(currentEstimate.pricing.bookingFee) }}</span>
                </div>

                <div class="border-t pt-4">
                  <div class="flex justify-between text-lg font-bold">
                    <span>Total price (estimated)</span>
                    <span class="text-2xl">{{ formatPrice(currentEstimate.pricing.totalPrice) }}</span>
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

              <!-- Action Buttons -->
              <div class="flex gap-4 mt-6">
                <button
                  @click="proceedToBooking"
                  class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200"
                >
                  Continue to Booking
                </button>
                <button
                  @click="handleSaveEstimate"
                  class="px-6 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Save Estimate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm">
        <div class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm text-red-800 font-medium">Error</p>
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AddressAutocomplete from './components/AddressAutocomplete.vue';
import HereMap from './components/HereMap.vue';
import VehicleCard from './components/VehicleCard.vue';
import EstimateProgress from '@/components/estimate/EstimateProgress.vue';
import { useEstimate } from '@/composables/useEstimate';
import autocompleteService from '@/services/autocomplete.service';
import type { PlaceResult, Vehicle } from '@/types/estimate.types';

// Composables
const route = useRoute();
const router = useRouter();
const {
  // State
  pickupLocation,
  destinationLocation,
  selectedVehicle,
  estimatedDuration,
  currentEstimate,
  availableVehicles,
  isCalculating,
  error,

  // Getters
  canCalculateEstimate,
  estimateProgress,
  estimateStatusText,

  // Actions
  setPickupLocation,
  setDestinationLocation,
  setSelectedVehicle,
  setEstimatedDuration,
  calculateEstimate,
  saveEstimate,

  // Utilities
  formatPrice,
} = useEstimate();

// Refs
const pickupRef = ref<InstanceType<typeof AddressAutocomplete> | null>(null);
const destinationRef = ref<InstanceType<typeof AddressAutocomplete> | null>(null);
const mapRef = ref<InstanceType<typeof HereMap> | null>(null);
const mapContainer = ref<HTMLElement | null>(null);
const vehicleSection = ref<HTMLElement | null>(null);

// Local state
const pickupAddress = ref('');
const destinationAddress = ref('');
const userLocation = ref<{ lat: number; lng: number } | null>(null);

// Environment variables
const hereApiKey = import.meta.env.VITE_HERE_MAPS_API_KEY;

// Lifecycle
onMounted(() => {
  initializeFromQuery();
  getCurrentLocation();
});

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
  setPickupLocation({
    lat: address.position.lat,
    lng: address.position.lng,
    address: address.address.label,
  });
};

const handleDestinationSelected = (address: PlaceResult) => {
  setDestinationLocation({
    lat: address.position.lat,
    lng: address.position.lng,
    address: address.address.label,
  });
};

const handleVehicleSelect = (vehicle: Vehicle) => {
  setSelectedVehicle(vehicle);
};

const handleCalculateEstimate = async () => {
  try {
    await calculateEstimate();
    // Scroll to results
    nextTick(() => {
      const resultsSection = document.querySelector('.bg-gray-50');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  } catch (error) {
    console.error('Failed to calculate estimate:', error);
  }
};

const handleDurationChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  setEstimatedDuration(parseInt(target.value));
};

const scrollToVehicles = () => {
  if (!pickupLocation.value || !destinationLocation.value) {
    return;
  }

  nextTick(() => {
    vehicleSection.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
};

const handleSaveEstimate = async () => {
  try {
    await saveEstimate();
    // Show success message
  } catch (error) {
    console.error('Failed to save estimate:', error);
  }
};

const proceedToBooking = () => {
  // Future: Navigate to booking page
  console.log('Proceeding to booking with estimate:', currentEstimate.value);
  // router.push({ name: 'booking', params: { estimateId: currentEstimate.value.id } });
};
</script>

<style scoped>
/* Custom styles for the estimate page */
.vehicle-section {
  scroll-margin-top: 2rem;
}

/* Ensure the map takes full height */
.map-container {
  position: relative;
  overflow: hidden;
}
</style>
