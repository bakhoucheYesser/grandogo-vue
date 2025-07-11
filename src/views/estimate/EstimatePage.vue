<template>
  <div class="min-h-screen">
    <!-- Titre principal au-dessus de la map -->
    <div class="text-center py-12">
      <h1 class="text-5xl lg:text-7xl font-black text-gray-900 mb-4 drop-shadow-lg">
        Start Your <span class="text-red-600/50">Estimate</span>
      </h1>
      <p class="text-xl lg:text-2xl text-gray-700 font-medium drop-shadow-md">
        Tell us where you're going to see your price and book your move
      </p>
    </div>

    <!-- Hero Section avec Map -->
    <section class="relative h-screen overflow-hidden">
      <!-- Map Background en plein écran -->
      <div class="absolute inset-0 z-0">
        <HereMap
          ref="mapRef"
          :pickup="selectedPickup"
          :destination="selectedDestination"
          :api-key="hereApiKey"
          :user-location="userLocation"
          class="w-full h-full"
        />

        <!-- Léger overlay pour améliorer la lisibilité -->
        <div class="absolute inset-0 bg-black/5"></div>
      </div>

<!--      &lt;!&ndash; Navigation et contrôles (optionnel) &ndash;&gt;-->
<!--      <div class="absolute top-4 right-4 z-20 space-y-2">-->
<!--        <button-->
<!--          @click="centerOnUserLocation"-->
<!--          :disabled="!userLocation"-->
<!--          class="p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"-->
<!--          title="Center on my location"-->
<!--        >-->
<!--          <svg class="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>-->
<!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>-->
<!--          </svg>-->
<!--        </button>-->
<!--      </div>-->

      <!-- Contenu principal centré -->
      <div class="absolute top-0 left-0 right-0 flex flex-col items-center z-10 px-4 pt-6">
        <!-- Formulaire principal style GrandoGo -->
            <AddressSearchForm
              submit-text="See Prices"
              mode="emit"
              :show-progress="true"
              :show-quick-actions="true"
              :initial-pickup="initialPickup"
              :initial-destination="initialDestination"
              :user-location="userLocation"
              @submit="handleFormSubmit"
              @pickup-selected="handlePickupSelected"
              @destination-selected="handleDestinationSelected"
            />
      </div>

      <!-- Informations de route flottantes -->
      <div
        v-if="selectedPickup && selectedDestination && routeInfo"
        class="absolute bottom-8 left-8 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 max-w-sm"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </div>
          <div>
            <div class="text-lg font-bold text-gray-900">
              {{ formatDistance(routeInfo.summary.length) }}
            </div>
            <div class="text-sm text-gray-600">
              {{ formatDuration(routeInfo.summary.duration) }} estimated
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vehicle Selection Section -->
    <section v-if="canCalculateRoute" ref="vehicleSection" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Choose your vehicle</h2>
          <p class="text-xl text-gray-600">Select the perfect size for your move</p>
        </div>

        <!-- Vehicle Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <!-- Pickup Vehicle -->
          <div
            class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 cursor-pointer"
            :class="selectedVehicle?.type === 'pickup' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
            @click="selectVehicle(vehicles.pickup)"
          >
            <div class="text-center">
              <img :src="pickupImage" alt="Pickup truck" class="w-24 h-16 mx-auto mb-4 object-contain" />
              <h3 class="text-xl font-bold text-gray-900 mb-2">Pickup</h3>
              <p class="text-gray-600 mb-4">2 Movers • Perfect for smaller items</p>
              <div class="text-2xl font-black text-red-600 mb-2">
                ${{ calculateVehiclePrice(vehicles.pickup) }}
              </div>
              <p class="text-sm text-gray-500 mb-4">Estimated total</p>
              <button
                class="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                :class="selectedVehicle?.type === 'pickup'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ selectedVehicle?.type === 'pickup' ? 'Selected' : 'Select' }}
              </button>
            </div>
          </div>

          <!-- Van Vehicle -->
          <div
            class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 cursor-pointer"
            :class="selectedVehicle?.type === 'van' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
            @click="selectVehicle(vehicles.van)"
          >
            <div class="text-center">
              <img :src="vanImage" alt="Van" class="w-24 h-16 mx-auto mb-4 object-contain" />
              <h3 class="text-xl font-bold text-gray-900 mb-2">Van</h3>
              <p class="text-gray-600 mb-4">2 Movers • Good for medium loads</p>
              <div class="text-2xl font-black text-red-600 mb-2">
                ${{ calculateVehiclePrice(vehicles.van) }}
              </div>
              <p class="text-sm text-gray-500 mb-4">Estimated total</p>
              <button
                class="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                :class="selectedVehicle?.type === 'van'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ selectedVehicle?.type === 'van' ? 'Selected' : 'Select' }}
              </button>
            </div>
          </div>

          <!-- XL Vehicle -->
          <div
            class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 cursor-pointer"
            :class="selectedVehicle?.type === 'xl' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
            @click="selectVehicle(vehicles.xl)"
          >
            <div class="text-center">
              <img :src="xlImage" alt="XL truck" class="w-24 h-16 mx-auto mb-4 object-contain" />
              <h3 class="text-xl font-bold text-gray-900 mb-2">XL</h3>
              <p class="text-gray-600 mb-4">2 Movers • Ideal for larger items</p>
              <div class="text-2xl font-black text-red-600 mb-2">
                ${{ calculateVehiclePrice(vehicles.xl) }}
              </div>
              <p class="text-sm text-gray-500 mb-4">Estimated total</p>
              <button
                class="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                :class="selectedVehicle?.type === 'xl'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ selectedVehicle?.type === 'xl' ? 'Selected' : 'Select' }}
              </button>
            </div>
          </div>

          <!-- Box Vehicle -->
          <div
            class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 cursor-pointer"
            :class="selectedVehicle?.type === 'box' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
            @click="selectVehicle(vehicles.box)"
          >
            <div class="text-center">
              <img :src="boxImage" alt="Box truck" class="w-24 h-16 mx-auto mb-4 object-contain" />
              <h3 class="text-xl font-bold text-gray-900 mb-2">Box Truck</h3>
              <p class="text-gray-600 mb-4">2 Movers • For full moves</p>
              <div class="text-2xl font-black text-red-600 mb-2">
                ${{ calculateVehiclePrice(vehicles.box) }}
              </div>
              <p class="text-sm text-gray-500 mb-4">Estimated total</p>
              <button
                class="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                :class="selectedVehicle?.type === 'box'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ selectedVehicle?.type === 'box' ? 'Selected' : 'Select' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Price Breakdown Section -->
    <section v-if="selectedVehicle && routeInfo" class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <!-- Time Estimate -->
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Estimated Time</h3>
              <div class="text-4xl font-black text-orange-600 mb-2">{{ estimatedTime }} min</div>
              <p class="text-gray-600">Time to load and unload your items</p>
            </div>
          </div>

          <!-- Price Breakdown -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Price Breakdown</h3>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Base fare ({{ selectedVehicle.name }})</span>
                <span class="font-semibold">${{ selectedVehicle.basePrice.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Distance ({{ formatDistance(routeInfo.summary.length) }})</span>
                <span class="font-semibold">${{ getMileageCost().toFixed(2) }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Labor ({{ estimatedTime }} mins)</span>
                <span class="font-semibold">${{ getLaborCost().toFixed(2) }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-gray-600">Service fee</span>
                <span class="font-semibold">${{ getServiceFee().toFixed(2) }}</span>
              </div>

              <hr class="border-gray-200">

              <div class="flex justify-between items-center text-xl font-bold">
                <span>Total (estimated)</span>
                <span class="text-red-600">${{ getTotalPrice().toFixed(2) }}</span>
              </div>
            </div>

            <!-- Continue Button -->
            <button
              @click="proceedToBooking"
              class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mb-4">For all moves, big or small</h2>
          <p class="text-xl text-gray-600">Professional movers and the right vehicle for every job</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <!-- Feature 1 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Fully Insured</h3>
            <p class="text-gray-600">All moves are covered by comprehensive insurance for your peace of mind.</p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">On Your Schedule</h3>
            <p class="text-gray-600">Book moves as soon as 30 minutes or schedule for a convenient time.</p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Professional Team</h3>
            <p class="text-gray-600">Background-checked movers with the tools and skills to handle your items safely.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useAddressSearch } from '@/composables/useAddressSearch';
import type { PlaceResult, RouteResult, Location } from '@/types/address.types';
import toastService from '@/services/toast.service';

// Import images
import pickupImage from '@/assets/images/illustrations/pickup_truck.svg';
import vanImage from '@/assets/images/illustrations/van_truck.svg';
import xlImage from '@/assets/images/illustrations/xl_truck.svg';
import boxImage from '@/assets/images/illustrations/box_truck.svg';

// Import components
import AddressSearchForm from '@/components/shared/AddressSearchForm.vue';
import HereMap from './components/HereMap.vue';

// HERE Maps API Key
const hereApiKey = import.meta.env.VITE_HERE_API_KEY || process.env.VUE_APP_HERE_API_KEY || '';

// Route
const route = useRoute();

// Use address search composable
const {
  pickupAddress,
  destinationAddress,
  selectedPickup,
  selectedDestination,
  userLocation,
  canCalculateRoute,
  handlePickupSelected: baseHandlePickupSelected,
  handleDestinationSelected: baseHandleDestinationSelected,
  calculateDistance,
  formatDistance,
  formatDuration,
  initialize
} = useAddressSearch({
  initializeFromRoute: true,
  autoGetLocation: true
});

// Refs
const vehicleSection = ref<HTMLElement | null>(null);
const mapRef = ref<InstanceType<typeof HereMap> | null>(null);

// State
const selectedVehicle = ref<any>(null);
const routeInfo = ref<RouteResult | null>(null);
const isCalculatingRoute = ref(false);
const estimatedTime = ref(45);

// Initial values from route
const initialPickup = computed(() => {
  return (route.query.pickup as string) || '';
});

const initialDestination = computed(() => {
  return (route.query.destination as string) || '';
});

// Vehicle definitions
const vehicles = ref({
  pickup: {
    type: 'pickup',
    name: 'Pickup',
    description: '2 Movers',
    basePrice: 40.00,
    perMinute: 1.50,
    perMile: 2.00,
  },
  van: {
    type: 'van',
    name: 'Van',
    description: '2 Movers',
    basePrice: 55.00,
    perMinute: 1.75,
    perMile: 2.25,
  },
  xl: {
    type: 'xl',
    name: 'XL Truck',
    description: '2 Movers',
    basePrice: 70.00,
    perMinute: 2.00,
    perMile: 2.50,
  },
  box: {
    type: 'box',
    name: 'Box Truck',
    description: '2 Movers',
    basePrice: 90.00,
    perMinute: 2.50,
    perMile: 3.00,
  }
});

// Methods
const handleFormSubmit = (data: { pickup: Location | null; destination: Location | null }) => {
  if (data.pickup && data.destination) {
    scrollToVehicles();
  }
};

const handlePickupSelected = (address: PlaceResult) => {
  baseHandlePickupSelected(address);

  nextTick(() => {
    // Focus on destination if not filled
    // Auto-handled by the form component
  });
};

const handleDestinationSelected = (address: PlaceResult) => {
  baseHandleDestinationSelected(address);
};



const calculateRoute = async () => {
  if (!selectedPickup.value || !selectedDestination.value) return;

  try {
    isCalculatingRoute.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const distance = calculateDistance(selectedPickup.value, selectedDestination.value) * 1000; // Convert to meters
    const duration = Math.round(distance / 1000 * 120);

    routeInfo.value = {
      summary: {
        duration: duration,
        length: Math.round(distance)
      }
    };

  } catch (error) {
    console.error('Route calculation failed:', error);
    toastService.error('Failed to calculate route');
  } finally {
    isCalculatingRoute.value = false;
  }
};

// Watch for location changes
watch([selectedPickup, selectedDestination], () => {
  if (selectedPickup.value && selectedDestination.value) {
    calculateRoute();
  } else {
    routeInfo.value = null;
  }
}, { deep: true });



const scrollToVehicles = () => {
  if (!canCalculateRoute.value) {
    toastService.warning('Please select both pickup and destination addresses');
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
  toastService.success(`${vehicle.name} selected`);
};

const calculateVehiclePrice = (vehicle: any): string => {
  if (!routeInfo.value) {
    return vehicle.basePrice.toFixed(0);
  }

  let total = vehicle.basePrice;
  total += estimatedTime.value * vehicle.perMinute;
  const miles = routeInfo.value.summary.length * 0.000621371;
  total += miles * vehicle.perMile;
  total += total * 0.08;

  return Math.ceil(total).toFixed(0);
};

const getMileageCost = (): number => {
  if (!selectedVehicle.value || !routeInfo.value) return 0;
  const miles = routeInfo.value.summary.length * 0.000621371;
  return miles * selectedVehicle.value.perMile;
};

const getLaborCost = (): number => {
  if (!selectedVehicle.value) return 0;
  return estimatedTime.value * selectedVehicle.value.perMinute;
};

const getServiceFee = (): number => {
  if (!selectedVehicle.value || !routeInfo.value) return 0;
  const subtotal = selectedVehicle.value.basePrice + getMileageCost() + getLaborCost();
  return subtotal * 0.08;
};

const getTotalPrice = (): number => {
  if (!selectedVehicle.value || !routeInfo.value) return 0;
  return selectedVehicle.value.basePrice + getMileageCost() + getLaborCost() + getServiceFee();
};

const proceedToBooking = () => {
  if (!selectedVehicle.value || !selectedPickup.value || !selectedDestination.value) {
    toastService.warning('Please complete all selections');
    return;
  }

  toastService.success('Proceeding to booking...');

  console.log('Booking Details:', {
    vehicle: selectedVehicle.value,
    pickup: selectedPickup.value,
    destination: selectedDestination.value,
    estimatedPrice: getTotalPrice(),
    estimatedTime: estimatedTime.value
  });
};

// Lifecycle
onMounted(() => {
  initialize();
});
</script>

<style scoped>
/* Amélioration de l'overlay pour une meilleure lisibilité */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Animation pour le bouton */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Transitions fluides */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
