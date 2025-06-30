<!-- src/views/estimate/components/VehicleSelector.vue -->
<template>
  <div class="space-y-4">
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2">Choose your vehicle</h3>
      <p class="text-gray-600">Select the right size for your move</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.type"
        class="border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
        :class="[
          selectedVehicle?.type === vehicle.type
            ? 'border-red-500 bg-red-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300'
        ]"
        @click="selectVehicle(vehicle)"
      >
        <!-- Vehicle Image -->
        <div class="text-center mb-3">
          <img
            :src="vehicle.image"
            :alt="vehicle.name"
            class="w-16 h-12 mx-auto object-contain"
          />
        </div>

        <!-- Vehicle Name -->
        <h4 class="font-semibold text-center mb-2" :class="selectedVehicle?.type === vehicle.type ? 'text-red-700' : 'text-gray-900'">
          {{ vehicle.name }}
        </h4>

        <!-- Vehicle Description -->
        <p class="text-sm text-gray-600 text-center mb-3">
          {{ vehicle.description }}
        </p>

        <!-- Pricing -->
        <div class="text-center mb-3">
          <div class="text-lg font-bold text-red-600 mb-1">
            From ${{ vehicle.basePrice }}
          </div>
          <div class="text-xs text-gray-500">
            + ${{ vehicle.perMinute }}/min • ${{ vehicle.perKm }}/km
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-1 mb-4">
          <div v-for="feature in vehicle.features" :key="feature" class="flex items-center text-xs text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ feature }}
          </div>
        </div>

        <!-- Selection Indicator -->
        <div class="text-center">
          <div
            v-if="selectedVehicle?.type === vehicle.type"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Selected
          </div>
          <div
            v-else
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Select
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Vehicle Summary -->
    <div
      v-if="selectedVehicle"
      class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img
            :src="selectedVehicle.image"
            :alt="selectedVehicle.name"
            class="w-12 h-8 mr-3 object-contain"
          />
          <div>
            <h4 class="font-semibold text-red-900">{{ selectedVehicle.name }}</h4>
            <p class="text-sm text-red-700">{{ selectedVehicle.description }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg font-bold text-red-600">
            From ${{ selectedVehicle.basePrice }}
          </div>
          <div class="text-xs text-red-500">
            + ${{ selectedVehicle.perMinute }}/min • ${{ selectedVehicle.perKm }}/km
          </div>
        </div>
      </div>
    </div>

    <!-- Estimated Total (if distance/duration provided) -->
    <div
      v-if="selectedVehicle && (estimatedDistance || estimatedDuration)"
      class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div class="text-center">
        <h4 class="font-semibold text-blue-900 mb-2">Estimated Total</h4>
        <div class="text-2xl font-bold text-blue-600 mb-1">
          ${{ calculateEstimate() }}
        </div>
        <div class="text-sm text-blue-700">
          <span v-if="estimatedDistance">{{ formatDistance(estimatedDistance) }}</span>
          <span v-if="estimatedDistance && estimatedDuration"> • </span>
          <span v-if="estimatedDuration">{{ formatDuration(estimatedDuration) }}</span>
        </div>
        <div class="text-xs text-blue-600 mt-2">
          *Estimate includes base price, time, and distance
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Import vehicle images
import pickup from '@/assets/images/illustrations/pickup_truck.svg';
import van from '@/assets/images/illustrations/van_truck.svg';
import xl from '@/assets/images/illustrations/xl_truck.svg';
import box from '@/assets/images/illustrations/box_truck.svg';

interface Vehicle {
  type: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  perMinute: number;
  perKm: number;
  features: string[];
}

interface Props {
  estimatedDistance?: number; // in meters
  estimatedDuration?: number; // in seconds
  modelValue?: Vehicle | null;
}

interface Emits {
  (e: 'update:modelValue', vehicle: Vehicle | null): void;
  (e: 'vehicleSelected', vehicle: Vehicle): void;
}

const props = withDefaults(defineProps<Props>(), {
  estimatedDistance: 0,
  estimatedDuration: 0,
  modelValue: null
});

const emit = defineEmits<Emits>();

// Vehicle options
const vehicles: Vehicle[] = [
  {
    type: 'pickup',
    name: 'Pickup',
    description: 'Perfect for smaller items',
    image: pickup,
    basePrice: 40,
    perMinute: 1.50,
    perKm: 2.00,
    features: [
      'Up to 500 lbs',
      '6ft truck bed',
      'Single item moves',
      'Quick deliveries'
    ]
  },
  {
    type: 'van',
    name: 'Van',
    description: 'Good for medium loads',
    image: van,
    basePrice: 50,
    perMinute: 1.75,
    perKm: 2.25,
    features: [
      'Up to 1,000 lbs',
      'Enclosed cargo',
      'Furniture delivery',
      'Weather protection'
    ]
  },
  {
    type: 'xl',
    name: 'XL Truck',
    description: 'Ideal for larger items',
    image: xl,
    basePrice: 65,
    perMinute: 2.00,
    perKm: 2.50,
    features: [
      'Up to 2,000 lbs',
      '8ft truck bed',
      'Large furniture',
      'Multiple items'
    ]
  },
  {
    type: 'box_truck',
    name: 'Box Truck',
    description: 'For full moves',
    image: box,
    basePrice: 85,
    perMinute: 2.50,
    perKm: 3.00,
    features: [
      'Up to 4,000 lbs',
      '12ft cargo space',
      'Full apartment moves',
      'Maximum capacity'
    ]
  }
];

// Selected vehicle
const selectedVehicle = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Methods
const selectVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  emit('vehicleSelected', vehicle);
};

const calculateEstimate = (): string => {
  if (!selectedVehicle.value || (!props.estimatedDistance && !props.estimatedDuration)) {
    return '0';
  }

  let total = selectedVehicle.value.basePrice;

  // Add time cost (convert seconds to minutes)
  if (props.estimatedDuration > 0) {
    const minutes = Math.ceil(props.estimatedDuration / 60);
    total += minutes * selectedVehicle.value.perMinute;
  }

  // Add distance cost (convert meters to kilometers)
  if (props.estimatedDistance > 0) {
    const kilometers = props.estimatedDistance / 1000;
    total += kilometers * selectedVehicle.value.perKm;
  }

  return Math.ceil(total).toString();
};

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
</script>
