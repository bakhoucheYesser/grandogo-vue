<!-- src/views/estimate/components/VehicleImage.vue -->
<template>
  <div class="flex items-center justify-center">
    <div
      v-if="showSvg"
      class="vehicle-icon"
      :class="iconClass"
      v-html="getSvgIcon(vehicleType)"
    ></div>
    <img
      v-else
      :src="getImageUrl(vehicleType)"
      :alt="vehicleType"
      :class="imageClass"
      @error="showSvg = true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  vehicleType: string;
  size?: 'sm' | 'md' | 'lg';
  white?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  white: false
});

const showSvg = ref(false);

const iconClass = computed(() => {
  const sizeClasses = {
    sm: 'w-8 h-6',
    md: 'w-16 h-12',
    lg: 'w-24 h-18'
  };

  return [
    sizeClasses[props.size],
    props.white ? 'text-white' : 'text-gray-600'
  ];
});

const imageClass = computed(() => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-12',
    lg: 'h-18'
  };

  return [
    sizeClasses[props.size],
    'object-contain',
    props.white ? 'filter brightness-0 invert' : ''
  ];
});

const getImageUrl = (type: string): string => {
  const baseUrl = '/images';
  const imageMap: Record<string, string> = {
    pickup: `${baseUrl}/pickup-truck.svg`,
    van: `${baseUrl}/van-truck.svg`,
    xl: `${baseUrl}/xl-truck.svg`,
    box: `${baseUrl}/box-truck.svg`
  };

  return imageMap[type] || imageMap.pickup;
};

const getSvgIcon = (type: string): string => {
  const color = props.white ? 'currentColor' : '#6b7280';

  const svgIcons: Record<string, string> = {
    pickup: `
      <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <!-- Pickup truck body -->
        <rect x="10" y="25" width="50" height="20" fill="${color}" rx="2"/>
        <!-- Cab -->
        <rect x="55" y="15" width="25" height="30" fill="${color}" rx="2"/>
        <!-- Wheels -->
        <circle cx="25" cy="50" r="6" fill="${color}"/>
        <circle cx="65" cy="50" r="6" fill="${color}"/>
        <!-- Details -->
        <rect x="15" y="30" width="40" height="10" fill="none" stroke="${color}" stroke-width="1"/>
        <rect x="58" y="20" width="15" height="8" fill="none" stroke="${color}" stroke-width="1"/>
      </svg>
    `,
    van: `
      <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <!-- Van body -->
        <rect x="10" y="15" width="70" height="30" fill="${color}" rx="3"/>
        <!-- Wheels -->
        <circle cx="25" cy="50" r="6" fill="${color}"/>
        <circle cx="65" cy="50" r="6" fill="${color}"/>
        <!-- Windows -->
        <rect x="60" y="20" width="15" height="10" fill="none" stroke="${color}" stroke-width="1"/>
        <!-- Door lines -->
        <line x1="45" y1="15" x2="45" y2="45" stroke="${color}" stroke-width="1"/>
      </svg>
    `,
    xl: `
      <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <!-- XL truck body -->
        <rect x="5" y="20" width="60" height="25" fill="${color}" rx="2"/>
        <!-- Cab -->
        <rect x="60" y="10" width="30" height="35" fill="${color}" rx="2"/>
        <!-- Wheels -->
        <circle cx="20" cy="50" r="7" fill="${color}"/>
        <circle cx="70" cy="50" r="7" fill="${color}"/>
        <!-- Details -->
        <rect x="10" y="25" width="45" height="15" fill="none" stroke="${color}" stroke-width="1"/>
      </svg>
    `,
    box: `
      <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <!-- Box truck body -->
        <rect x="5" y="10" width="60" height="35" fill="${color}" rx="2"/>
        <!-- Cab -->
        <rect x="60" y="15" width="30" height="30" fill="${color}" rx="2"/>
        <!-- Wheels -->
        <circle cx="20" cy="50" r="7" fill="${color}"/>
        <circle cx="75" cy="50" r="7" fill="${color}"/>
        <!-- Box details -->
        <rect x="10" y="15" width="45" height="25" fill="none" stroke="${color}" stroke-width="1"/>
        <line x1="32" y1="15" x2="32" y2="40" stroke="${color}" stroke-width="1"/>
      </svg>
    `
  };

  return svgIcons[type] || svgIcons.pickup;
};
</script>

<style scoped>
.vehicle-icon svg {
  width: 100%;
  height: 100%;
}
</style>
