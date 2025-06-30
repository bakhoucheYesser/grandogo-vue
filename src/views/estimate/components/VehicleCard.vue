<!-- src/views/estimate/components/VehicleCard.vue -->
<template>
  <div
    class="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl border-2"
    :class="[
      selected ? 'border-red-500 bg-red-50' : 'border-transparent hover:border-gray-200'
    ]"
    @click="$emit('select')"
  >
    <!-- Vehicle Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-xl font-bold text-gray-900">{{ vehicle.name }}</h3>
        <p class="text-sm text-blue-600 font-semibold">{{ vehicle.description }}</p>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-gray-900">${{ calculatePrice() }}</div>
      </div>
    </div>

    <!-- Vehicle Illustration -->
    <div class="flex justify-center mb-6">
      <div class="relative">
        <img
          :src="vehicle.image"
          :alt="vehicle.name"
          class="w-32 h-20 object-contain"
        />
        <!-- Dimensions overlay -->
        <div class="absolute -top-2 -right-2 text-xs text-gray-500">
          {{ getDimensions() }}
        </div>
        <!-- Luggers illustration -->
        <div class="absolute -bottom-2 -right-4">
          <div class="flex space-x-1">
            <div v-for="n in getLuggerCount()" :key="n" class="w-4 h-6 bg-blue-600 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Continue Button -->
    <button
      class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
      :class="[
        selected ? 'bg-red-600' : ''
      ]"
    >
      {{ selected ? 'Selected' : 'Continue' }}
    </button>

    <!-- Vehicle Features (if selected) -->
    <div v-if="selected" class="mt-4 pt-4 border-t border-red-200">
      <div class="space-y-2">
        <div class="flex items-center text-sm text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ getCapacity() }}
        </div>
        <div class="flex items-center text-sm text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ getLuggerCount() }} professional mover{{ getLuggerCount() > 1 ? 's' : '' }}
        </div>
        <div class="flex items-center text-sm text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ getUsageDescription() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Vehicle {
  type: string;
  name: string;
  description: string;
  basePrice: number;
  perMinute: number;
  perMile: number;
  image: string;
}

interface RouteInfo {
  summary: {
    duration: number;
    length: number;
  };
}

interface Props {
  vehicle: Vehicle;
  routeInfo?: RouteInfo | null;
  selected?: boolean;
}

interface Emits {
  (e: 'select'): void;
}

const props = withDefaults(defineProps<Props>(), {
  routeInfo: null,
  selected: false
});

const emit = defineEmits<Emits>();

// Methods
const calculatePrice = (): string => {
  if (!props.routeInfo) {
    return props.vehicle.basePrice.toFixed(2);
  }

  let total = props.vehicle.basePrice;

  // Add labor cost (30 minutes base)
  const laborMinutes = 30;
  total += laborMinutes * props.vehicle.perMinute;

  // Add mileage cost
  const miles = props.routeInfo.summary.length * 0.000621371; // Convert meters to miles
  total += miles * props.vehicle.perMile;

  // Add booking fee (6%)
  total += total * 0.06;

  return Math.ceil(total).toFixed(2);
};

const getDimensions = (): string => {
  switch (props.vehicle.type) {
    case 'pickup':
      return '6 ft';
    case 'van':
      return '8 ft';
    case 'xl':
      return '10 ft';
    case 'box':
      return '12 ft';
    default:
      return '6 ft';
  }
};

const getLuggerCount = (): number => {
  return props.vehicle.type === 'lite' ? 1 : 2;
};

const getCapacity = (): string => {
  switch (props.vehicle.type) {
    case 'pickup':
      return 'Up to 500 lbs';
    case 'van':
      return 'Up to 1,000 lbs';
    case 'xl':
      return 'Up to 2,000 lbs';
    case 'box':
      return 'Up to 4,000 lbs';
    default:
      return 'Up to 500 lbs';
  }
};

const getUsageDescription = (): string => {
  switch (props.vehicle.type) {
    case 'pickup':
      return 'Perfect for smaller items';
    case 'van':
      return 'Good for medium loads';
    case 'xl':
      return 'Ideal for larger items';
    case 'box':
      return 'For full moves';
    default:
      return 'Perfect for small items';
  }
};
</script>
