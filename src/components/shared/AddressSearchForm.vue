<!-- src/components/shared/AddressSearchForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="w-full">
    <div class="flex items-center bg-white border-2 border-gray-300 rounded-2xl p-2 shadow-lg hover:border-gray-400 focus-within:border-red-500 transition-all duration-200">

      <!-- Pickup Address Field -->
      <div class="flex-1 px-4 py-2">
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
        <!-- Input field with autocomplete -->
        <AddressAutocomplete
          ref="pickupRef"
          v-model="pickupAddress"
          type="pickup"
          placeholder="Pickup address"
          :user-location="userLocation"
          class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
          @address-selected="handlePickupSelected"
          @focus="handlePickupFocus"
          @blur="handlePickupBlur"
        />
      </div>

      <!-- Divider -->
      <div class="w-px h-12 bg-gray-300 mx-2"></div>

      <!-- Delivery Address Field -->
      <div class="flex-1 px-4 py-2">
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
        <!-- Input field with autocomplete -->
        <AddressAutocomplete
          ref="destinationRef"
          v-model="destinationAddress"
          type="destination"
          placeholder="Drop-off address"
          :user-location="userLocation"
          class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
          @address-selected="handleDestinationSelected"
          @focus="handleDestinationFocus"
          @blur="handleDestinationBlur"
        />
      </div>

      <!-- Submit Button -->
      <div class="ml-2">
        <button
          type="submit"
          :disabled="!canSubmit"
          class="bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/40 focus:ring-4 focus:outline-none focus:ring-red-300 transition-all duration-200 whitespace-nowrap"
          :class="[
            canSubmit
              ? 'hover:scale-105 active:scale-95'
              : 'opacity-75'
          ]"
        >
          {{ submitText }}
        </button>
      </div>
    </div>


    <!-- Quick actions (optional) -->
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { PlaceResult, Location } from '@/types/address.types';
import AddressAutocomplete from '@/views/estimate/components/AddressAutocomplete.vue';
import toastService from '@/services/toast.service';

interface Props {
  // Texte du bouton de soumission
  submitText?: string;
  // Mode: 'navigate' pour rediriger, 'emit' pour émettre un événement
  mode?: 'navigate' | 'emit';
  // Afficher les indicateurs de progression
  showProgress?: boolean;
  // Afficher les actions rapides (swap, clear)
  showQuickActions?: boolean;
  // Valeurs initiales
  initialPickup?: string;
  initialDestination?: string;
  // Localisation de l'utilisateur
  userLocation?: { lat: number; lng: number } | null;
}

interface Emits {
  (e: 'submit', data: { pickup: Location | null; destination: Location | null }): void;
  (e: 'pickup-selected', address: PlaceResult): void;
  (e: 'destination-selected', address: PlaceResult): void;
  (e: 'addresses-swapped'): void;
  (e: 'addresses-cleared'): void;
}

const props = withDefaults(defineProps<Props>(), {
  submitText: 'See prices',
  mode: 'navigate',
  showProgress: false,
  showQuickActions: false,
  initialPickup: '',
  initialDestination: '',
  userLocation: null
});

const emit = defineEmits<Emits>();

// Router pour la navigation
const router = useRouter();

// Refs pour les composants
const pickupRef = ref<InstanceType<typeof AddressAutocomplete> | null>(null);
const destinationRef = ref<InstanceType<typeof AddressAutocomplete> | null>(null);

// State
const pickupAddress = ref(props.initialPickup);
const destinationAddress = ref(props.initialDestination);
const selectedPickup = ref<Location | null>(null);
const selectedDestination = ref<Location | null>(null);

// Computed
const canSubmit = computed(() => {
  return selectedPickup.value && selectedDestination.value;
});

// Methods
const handlePickupFocus = () => {
  // Logique de focus si nécessaire
};

const handlePickupBlur = () => {
  // Logique de blur si nécessaire
};

const handleDestinationFocus = () => {
  // Logique de focus si nécessaire
};

const handleDestinationBlur = () => {
  // Logique de blur si nécessaire
};

const handlePickupSelected = (address: PlaceResult) => {
  selectedPickup.value = {
    lat: address.position.lat,
    lng: address.position.lng,
    address: address.address.label
  };

  // Auto-focus sur destination
  nextTick(() => {
    if (!destinationAddress.value && destinationRef.value) {
      setTimeout(() => {
        destinationRef.value?.focus();
      }, 300);
    }
  });

  emit('pickup-selected', address);
};

const handleDestinationSelected = (address: PlaceResult) => {
  selectedDestination.value = {
    lat: address.position.lat,
    lng: address.position.lng,
    address: address.address.label
  };

  emit('destination-selected', address);
};

const swapAddresses = () => {
  if (selectedPickup.value && selectedDestination.value) {
    // Swap locations
    const tempPickup = selectedPickup.value;
    const tempPickupAddress = pickupAddress.value;

    selectedPickup.value = selectedDestination.value;
    pickupAddress.value = destinationAddress.value;

    selectedDestination.value = tempPickup;
    destinationAddress.value = tempPickupAddress;

    emit('addresses-swapped');
    toastService.success('Addresses swapped');
  }
};

const clearAllAddresses = () => {
  pickupAddress.value = '';
  destinationAddress.value = '';
  selectedPickup.value = null;
  selectedDestination.value = null;

  emit('addresses-cleared');
  toastService.success('All addresses cleared');
};

const handleSubmit = () => {
  if (!canSubmit.value) {
    if (!selectedPickup.value) {
      pickupRef.value?.focus();
      toastService.warning('Please select a pickup address');
      return;
    }
    if (!selectedDestination.value) {
      destinationRef.value?.focus();
      toastService.warning('Please select a destination address');
      return;
    }
  }

  const submitData = {
    pickup: selectedPickup.value,
    destination: selectedDestination.value
  };

  if (props.mode === 'navigate') {
    // Navigation vers la page d'estimation avec les paramètres
    router.push({
      name: 'estimate',
      query: {
        pickup: pickupAddress.value,
        destination: destinationAddress.value
      }
    });
  } else {
    // Émission de l'événement pour gestion parent
    emit('submit', submitData);
  }
};

// Récupérer la géolocalisation
const getCurrentLocation = async () => {
  if (props.userLocation) return;

  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // La localisation sera gérée par le composant parent si nécessaire
        },
        () => {
          // Géolocalisation échouée, pas grave
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  } catch (error) {
    console.warn('Failed to get user location:', error);
  }
};

// Watch pour les valeurs initiales
watch(
  () => props.initialPickup,
  (newValue) => {
    if (newValue !== pickupAddress.value) {
      pickupAddress.value = newValue;
    }
  }
);

watch(
  () => props.initialDestination,
  (newValue) => {
    if (newValue !== destinationAddress.value) {
      destinationAddress.value = newValue;
    }
  }
);

// Méthodes exposées
const focusPickup = () => {
  pickupRef.value?.focus();
};

const focusDestination = () => {
  destinationRef.value?.focus();
};

const setPickupAddress = (address: string) => {
  pickupAddress.value = address;
};

const setDestinationAddress = (address: string) => {
  destinationAddress.value = address;
};

// Lifecycle
onMounted(() => {
  getCurrentLocation();
});

// Expose methods
defineExpose({
  focusPickup,
  focusDestination,
  setPickupAddress,
  setDestinationAddress,
  clearAllAddresses,
  swapAddresses,
  canSubmit: canSubmit.value,
  selectedPickup: selectedPickup.value,
  selectedDestination: selectedDestination.value
});
</script>

<style scoped>
/* Animations pour les transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Effet hover sur le bouton */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.active\:scale-95:active {
  transform: scale(0.95);
}

/* Custom focus styles */
.focus\:ring-4:focus {
  box-shadow: 0 0 0 4px rgb(239 68 68 / 0.3);
}
</style>
