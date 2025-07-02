<!-- src/views/estimate/EstimatePage.vue - Design exact des images -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header avec formulaire d'adresse -->
    <div class="relative bg-white">
      <!-- Map Container -->
      <div class="h-screen w-full relative">
        <HereMap
          ref="mapRef"
          :pickup="pickupLocation"
          :destination="destinationLocation"
          :api-key="hereApiKey"
          class="w-full h-full"
        />

        <!-- Overlay pour titre et formulaire -->
        <div class="absolute inset-0 bg-black bg-opacity-20 flex flex-col">
          <!-- Titre -->
          <div class="text-center pt-24 pb-8">
            <h1 class="text-5xl font-bold text-white mb-4">Get an estimate</h1>
            <p class="text-lg text-white">Enter your addresses to see your prices and schedule your Lugg</p>
          </div>

          <!-- Formulaire d'adresse (même style que HomePage) -->
          <div class="max-w-5xl mx-auto px-4 mb-8">
            <div class="flex items-center bg-white border-2 border-gray-300 rounded-2xl p-2 shadow-lg hover:border-gray-400 focus-within:border-red-500 transition-all duration-200">

              <!-- Pickup Address Field -->
              <div class="flex-1 px-4 py-2 relative">
                <!-- Label and Icon on same line -->
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke-width="2" stroke="currentColor"
                       class="w-4 h-4 text-red-600 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"></path>
                  </svg>
                  <div class="text-xs font-medium text-red-600">Pick up from</div>
                </div>
                <!-- Input field -->
                <AddressAutocomplete
                  ref="pickupRef"
                  v-model="pickupAddress"
                  type="pickup"
                  placeholder="Pickup address"
                  :user-location="userLocation"
                  class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                  @address-selected="handlePickupSelected"
                />
              </div>

              <!-- Divider -->
              <div class="w-px h-12 bg-gray-300 mx-2"></div>

              <!-- Delivery Address Field -->
              <div class="flex-1 px-4 py-2 relative">
                <!-- Label and Icon on same line -->
                <div class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       stroke-width="2" stroke="currentColor"
                       class="w-4 h-4 text-red-600 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"></path>
                  </svg>
                  <div class="text-xs font-medium text-red-600">Move to</div>
                </div>
                <!-- Input field -->
                <AddressAutocomplete
                  ref="destinationRef"
                  v-model="destinationAddress"
                  type="destination"
                  placeholder="Drop-off address"
                  :user-location="userLocation"
                  class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                  @address-selected="handleDestinationSelected"
                />
              </div>

              <!-- Submit Button -->
              <div class="ml-2">
                <button
                  @click="handleSeePrice"
                  :disabled="!canProceed"
                  type="button"
                  class="bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/40 focus:ring-4 focus:outline-none focus:ring-red-300 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  See prices
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar gauche pour les véhicules (quand adresses sélectionnées) -->
        <div
          v-if="showVehicleSelection"
          class="absolute left-0 top-0 w-96 h-full bg-white shadow-xl z-20 transform transition-transform duration-500"
          :class="showVehicleSelection ? 'translate-x-0' : '-translate-x-full'"
        >
          <!-- Header sidebar -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="font-bold text-lg">{{ pickupLocation?.address?.split(',')[0] || 'Pickup' }}</h2>
                <p class="text-sm text-gray-600">to {{ destinationLocation?.address?.split(',')[0] || 'Destination' }}</p>
              </div>
              <button
                @click="showVehicleSelection = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Route details -->
            <div class="text-sm text-gray-600 space-y-1">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Few Items
              </div>
              <div class="flex items-center">
                <span class="text-orange-500 mr-2">📍</span>
                Avg. Studio
              </div>
              <div class="flex items-center">
                <span class="text-blue-500 mr-2">🏠</span>
                Avg. 1 BR
              </div>
              <div class="flex items-center">
                <span class="text-red-500 mr-2">🏢</span>
                Avg. 2 BR
              </div>
            </div>
          </div>

          <!-- Liste des véhicules -->
          <div class="p-6 space-y-4 overflow-y-auto h-full">
            <!-- Pickup -->
            <div class="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <h3 class="font-bold text-lg">Pickup</h3>
                  <span class="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">2 Luggers</span>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold">$62.02</div>
                  <div class="text-sm text-gray-500">+ $1.94 per min labor</div>
                </div>
              </div>

              <div class="flex justify-center mb-3">
                <VehicleImage vehicle-type="pickup" size="md" />
              </div>

              <button
                @click="selectVehicleAndContinue('pickup')"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Continue
              </button>

              <!-- Save banner -->
              <div class="mt-3 p-3 bg-blue-100 rounded-lg">
                <div class="text-blue-800 font-semibold text-sm">Save 35% — Get 1 Lugger</div>
                <div class="text-blue-700 text-xs">Get a single Lugger. Be ready to help if it's too heavy.</div>
              </div>
            </div>

            <!-- Van -->
            <div class="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <h3 class="font-bold text-lg">Van</h3>
                  <span class="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">2 Luggers</span>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold">$106.49</div>
                  <div class="text-sm text-gray-500">+ $2.42 per min labor</div>
                </div>
              </div>

              <div class="flex justify-center mb-3">
                <VehicleImage vehicle-type="van" size="md" />
              </div>

              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                Continue
              </button>
            </div>

            <!-- XL -->
            <div class="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <h3 class="font-bold text-lg">XL</h3>
                  <span class="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">2 Luggers</span>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold">$187.52</div>
                  <div class="text-sm text-gray-500">+ $2.76 per min labor</div>
                </div>
              </div>

              <div class="flex justify-center mb-3">
                <VehicleImage vehicle-type="xl" size="md" />
              </div>

              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                Continue
              </button>
            </div>

            <!-- Box -->
            <div class="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <h3 class="font-bold text-lg">Box</h3>
                  <span class="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">2 Luggers</span>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold">$203.92</div>
                  <div class="text-sm text-gray-500">+ $3.00 per min labor</div>
                </div>
              </div>

              <div class="flex justify-center mb-3">
                <VehicleImage vehicle-type="box" size="md" />
              </div>

              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section bottom "Understand your estimate" -->
    <div
      v-if="showEstimateDetails"
      class="bg-white border-t border-gray-200 py-12"
    >
      <!-- Top rated movers -->
      <div class="container mx-auto px-4 mb-8">
        <div class="text-center mb-6">
          <h3 class="text-lg font-semibold mb-4">Top rated movers nationwide</h3>
        </div>

        <div class="flex justify-center items-center space-x-12">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-400 rounded flex items-center justify-center mr-3">
              <span class="text-white font-bold text-sm">lugg</span>
            </div>
            <div>
              <div class="font-bold text-lg">4.9/5</div>
              <div class="text-sm text-gray-500">356K Reviews</div>
            </div>
          </div>

          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-500 rounded flex items-center justify-center mr-3">
              <span class="text-white text-xl">⚡</span>
            </div>
            <div>
              <div class="font-bold text-lg">4.9/5</div>
              <div class="text-sm text-gray-500">37.8K Ratings</div>
            </div>
          </div>

          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-500 rounded flex items-center justify-center mr-3">
              <span class="text-white text-xl">▶</span>
            </div>
            <div>
              <div class="font-bold text-lg">4.8/5</div>
              <div class="text-sm text-gray-500">816 Reviews</div>
            </div>
          </div>

          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-600 rounded flex items-center justify-center mr-3">
              <span class="text-white text-xl">★</span>
            </div>
            <div>
              <div class="font-bold text-lg">4.8/5</div>
              <div class="text-sm text-gray-500">463 Reviews</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Understand your estimate -->
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-4">Understand your estimate</h2>
          <p class="text-gray-600">Enter addresses to explore prices with how many items you need moved</p>
        </div>

        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Colonne gauche -->
          <div class="space-y-6">
            <!-- Route info -->
            <div class="space-y-3">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"></path>
                </svg>
                <span class="text-sm">87-12 77th Ave, Flushing</span>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span class="text-sm">810 Burns St, Forest Hills</span>
              </div>
            </div>

            <!-- Vehicle selection grid -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Pickup selected -->
              <div class="bg-blue-600 text-white p-4 rounded-lg text-center">
                <img :src="pickup" alt="Pickup"  class="h-12 mx-auto mb-2" />
                <div class="font-semibold">Pickup</div>
              </div>

              <!-- Van -->
              <div class="border border-gray-200 p-4 rounded-lg text-center hover:border-gray-300 cursor-pointer">
                <img :src="van" alt="Van" class="h-12 mx-auto mb-2" />
                <div class="font-semibold text-gray-600">Van</div>
              </div>

              <!-- XL -->
              <div class="border border-gray-200 p-4 rounded-lg text-center hover:border-gray-300 cursor-pointer">
                <img :src="xl"  alt="XL" class="h-12 mx-auto mb-2" />
                <div class="font-semibold text-gray-600">XL</div>
              </div>

              <!-- Box -->
              <div class="border border-gray-200 p-4 rounded-lg text-center hover:border-gray-300 cursor-pointer">
                <img :src="box" alt="Box" class="h-12 mx-auto mb-2" />
                <div class="font-semibold text-gray-600">Box</div>
              </div>
            </div>

            <!-- Save banner -->
            <div class="bg-blue-100 border border-blue-300 rounded-lg p-4">
              <div class="text-blue-800 font-semibold text-sm">Save 35% — Get 1 Lugger</div>
              <div class="text-blue-700 text-xs mt-1">Save by getting a single Lugger. Be ready to help if it's too heavy.</div>
            </div>
          </div>

          <!-- Colonne droite - Price breakdown -->
          <div class="bg-gray-50 p-8 rounded-xl">
            <!-- Duration estimate -->
            <div class="text-center mb-8">
              <div class="text-4xl font-bold mb-2">30 min</div>
              <div class="text-gray-600">Estimated time to load and unload your items.</div>
            </div>

            <!-- Price details -->
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Base fare (Lugg Pickup)</span>
                <span class="font-semibold">$45.60</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Traveled miles (4 mi)</span>
                <span class="font-semibold">$10.72</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Labor fee (30 mins)</span>
                <span class="font-semibold">$58.20</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Booking Fee</span>
                <span class="font-semibold">$6.86</span>
              </div>
              <hr class="border-gray-300">
              <div class="flex justify-between text-lg font-bold">
                <span>Total price (estimated)</span>
                <span class="text-2xl">$121.38</span>
              </div>
            </div>

            <!-- Continue button -->
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg mt-8 transition-all">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div
      v-if="isCalculating"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-lg">
        <div class="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600">Calculating estimate...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AddressAutocomplete from './components/AddressAutocomplete.vue';
import HereMap from './components/HereMap.vue';
import { useEstimate } from '@/composables/useEstimate';
import autocompleteService from '@/services/autocomplete.service';
import type { PlaceResult } from '@/types/address.types';
import pickup from '@/assets/images/illustrations/pickup_truck.svg';
import van from '@/assets/images/illustrations/van_truck.svg';
import xl from '@/assets/images/illustrations/xl_truck.svg';
import box from '@/assets/images/illustrations/box_truck.svg';
import VehicleImage from '@/views/estimate/components/VehicleImage.vue'

// Composables
const route = useRoute();
const router = useRouter();
const {
  // State
  pickupLocation,
  destinationLocation,
  selectedVehicle,
  currentEstimate,
  availableVehicles,
  isCalculating,
  error,

  // Actions
  setPickupLocation,
  setDestinationLocation,
  setSelectedVehicle,
  calculateEstimate,
} = useEstimate();

// Refs
const pickupRef = ref<InstanceType<typeof AddressAutocomplete> | null>(null);
const destinationRef = ref<InstanceType<typeof AddressAutocomplete> | null>(null);
const mapRef = ref<InstanceType<typeof HereMap> | null>(null);

// Local state
const pickupAddress = ref('');
const destinationAddress = ref('');
const userLocation = ref<{ lat: number; lng: number } | null>(null);
const showVehicleSelection = ref(false);
const showEstimateDetails = ref(false);

// Environment variables
const hereApiKey = import.meta.env.VITE_HERE_MAPS_API_KEY || 'SD3QfadPmysROiTuZi-8RN0eSUofoj0NAr7BW7Vd4pE';

// Computed
const canProceed = computed(() => pickupLocation.value && destinationLocation.value);

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
  checkProgress();
};

const handleDestinationSelected = (address: PlaceResult) => {
  setDestinationLocation({
    lat: address.position.lat,
    lng: address.position.lng,
    address: address.address.label,
  });
  checkProgress();
};

const checkProgress = () => {
  if (pickupLocation.value && destinationLocation.value) {
    // Les deux adresses sont sélectionnées, ne pas montrer automatiquement les véhicules
    // L'utilisateur doit cliquer sur "See prices"
  }
};

const handleSeePrice = () => {
  if (canProceed.value) {
    showVehicleSelection.value = true;
  }
};

const selectVehicleAndContinue = async (vehicleType: string) => {
  // Simuler la sélection d'un véhicule et le calcul
  try {
    // Trouver le véhicule correspondant
    const vehicle = availableVehicles.value.find(v => v.id === vehicleType) || {
      id: vehicleType,
      name: vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1),
      displayName: vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1),
      description: 'Vehicle description',
      basePrice: vehicleType === 'pickup' ? 62.02 : 106.49,
      perMinute: vehicleType === 'pickup' ? 1.94 : 2.42,
      perKm: 2.0,
      maxWeight: 500,
      dimensions: '6ft',
      imageUrl: `/images/${vehicleType}-truck.svg`
    };

    setSelectedVehicle(vehicle);

    // Fermer la sidebar et montrer les détails
    showVehicleSelection.value = false;
    showEstimateDetails.value = true;

    // Optionnellement calculer l'estimation
    // await calculateEstimate();
  } catch (error) {
    console.error('Failed to select vehicle:', error);
  }
};
</script>

<style scoped>
/* Assurer que la map soit visible */
.h-screen {
  height: 100vh;
}

/* Transitions fluides */
.transform {
  transition: transform 0.5s ease-in-out;
}

/* Scrollbar pour sidebar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Ensure AddressAutocomplete inherits the styles */
:deep(.address-autocomplete-input) {
  @apply w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none;
}
</style>
