// src/composables/useAddressSearch.ts
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { PlaceResult, Location } from '@/types/address.types';
import toastService from '@/services/toast.service';

export interface AddressSearchState {
  pickupAddress: string;
  destinationAddress: string;
  selectedPickup: Location | null;
  selectedDestination: Location | null;
  userLocation: { lat: number; lng: number } | null;
}

export interface AddressSearchOptions {
  // Initialiser depuis les paramètres de route
  initializeFromRoute?: boolean;
  // Auto-récupérer la géolocalisation
  autoGetLocation?: boolean;
  // Valeurs initiales
  initialPickup?: string;
  initialDestination?: string;
}

export function useAddressSearch(options: AddressSearchOptions = {}) {
  const router = useRouter();
  const route = useRoute();

  // State
  const pickupAddress = ref(options.initialPickup || '');
  const destinationAddress = ref(options.initialDestination || '');
  const selectedPickup = ref<Location | null>(null);
  const selectedDestination = ref<Location | null>(null);
  const userLocation = ref<{ lat: number; lng: number } | null>(null);
  const isLoadingLocation = ref(false);

  // Computed
  const canCalculateRoute = computed(() => {
    return selectedPickup.value && selectedDestination.value;
  });

  const hasPickup = computed(() => Boolean(selectedPickup.value));
  const hasDestination = computed(() => Boolean(selectedDestination.value));

  // Methods
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

  const setPickupLocation = (location: Location, address?: string) => {
    selectedPickup.value = location;
    if (address) {
      pickupAddress.value = address;
    }
  };

  const setDestinationLocation = (location: Location, address?: string) => {
    selectedDestination.value = location;
    if (address) {
      destinationAddress.value = address;
    }
  };

  // Navigation vers la page d'estimation
  const navigateToEstimate = () => {
    if (!canCalculateRoute.value) {
      toastService.warning('Please select both pickup and destination addresses');
      return;
    }

    router.push({
      name: 'estimate',
      query: {
        pickup: pickupAddress.value,
        destination: destinationAddress.value
      }
    });
  };

  // Initialisation depuis les paramètres de route
  const initializeFromRouteQuery = () => {
    if (route.query.pickup && typeof route.query.pickup === 'string') {
      pickupAddress.value = route.query.pickup;
    }
    if (route.query.destination && typeof route.query.destination === 'string') {
      destinationAddress.value = route.query.destination;
    }
  };

  // Récupération de la géolocalisation
  const getCurrentLocation = async (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        resolve(null);
        return;
      }

      isLoadingLocation.value = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          userLocation.value = location;
          isLoadingLocation.value = false;
          resolve(location);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fallback vers Montreal par défaut
          const fallbackLocation = { lat: 45.5017, lng: -73.5673 };
          userLocation.value = fallbackLocation;
          isLoadingLocation.value = false;
          resolve(fallbackLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  };

  // Calculer la distance entre deux points (approximative)
  const calculateDistance = (point1: Location, point2: Location): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance en km
  };

  // Formatage utilitaires
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  // Validation des adresses
  const validateAddresses = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!selectedPickup.value) {
      errors.push('Please select a pickup address');
    }

    if (!selectedDestination.value) {
      errors.push('Please select a destination address');
    }

    if (selectedPickup.value && selectedDestination.value) {
      // Vérifier que les adresses ne sont pas identiques
      const distance = calculateDistance(selectedPickup.value, selectedDestination.value);
      if (distance < 0.1) { // Moins de 100m
        errors.push('Pickup and destination addresses are too close');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Obtenir les données pour l'estimation
  const getEstimateData = () => {
    if (!canCalculateRoute.value) {
      return null;
    }

    return {
      pickup: {
        address: selectedPickup.value!.address || pickupAddress.value,
        coordinates: {
          lat: selectedPickup.value!.lat,
          lng: selectedPickup.value!.lng
        }
      },
      destination: {
        address: selectedDestination.value!.address || destinationAddress.value,
        coordinates: {
          lat: selectedDestination.value!.lat,
          lng: selectedDestination.value!.lng
        }
      },
      userLocation: userLocation.value
    };
  };

  // Reset complet
  const reset = () => {
    pickupAddress.value = '';
    destinationAddress.value = '';
    selectedPickup.value = null;
    selectedDestination.value = null;
  };

  // Initialisation automatique
  const initialize = async () => {
    // Initialiser depuis la route si demandé
    if (options.initializeFromRoute) {
      initializeFromRouteQuery();
    }

    // Récupérer la géolocalisation si demandé
    if (options.autoGetLocation) {
      await getCurrentLocation();
    }
  };

  // Watchers pour la synchronisation
  watch([selectedPickup, selectedDestination], () => {
    // Logique additionnelle si nécessaire lors du changement des locations
  }, { deep: true });

  return {
    // State
    pickupAddress,
    destinationAddress,
    selectedPickup,
    selectedDestination,
    userLocation,
    isLoadingLocation,

    // Computed
    canCalculateRoute,
    hasPickup,
    hasDestination,

    // Methods - Sélection d'adresses
    handlePickupSelected,
    handleDestinationSelected,
    setPickupLocation,
    setDestinationLocation,

    // Methods - Actions
    navigateToEstimate,
    reset,

    // Methods - Utilitaires
    calculateDistance,
    formatDistance,
    formatDuration,
    validateAddresses,
    getCurrentLocation,
    getEstimateData,

    // Methods - Initialisation
    initialize,
    initializeFromRouteQuery
  };
}
