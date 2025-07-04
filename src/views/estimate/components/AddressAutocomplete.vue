<!-- src/views/estimate/components/AddressAutocomplete.vue -->
<template>
  <div class="relative w-full">
    <!-- Input field simple qui hérite des styles du parent -->
    <input
      ref="inputRef"
      v-model="query"
      type="text"
      :placeholder="placeholder"
      class="w-full text-base text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />

    <!-- Loading indicator (discret) -->
    <div v-if="loading" class="absolute right-2 top-1/2 transform -translate-y-1/2">
      <div class="animate-spin h-4 w-4 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- Dropdown results -->
    <div
      v-if="showResults && results.length > 0"
      class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
    >
      <div
        v-for="(result, index) in results"
        :key="result.id"
        class="px-4 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
        :class="{ 'bg-gray-50': selectedIndex === index }"
        @click="selectResult(result)"
        @mouseenter="selectedIndex = index"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 mt-1 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 truncate">{{ result.title }}</div>
            <div class="text-sm text-gray-500 truncate">{{ result.address.label }}</div>
            <div v-if="result.distance" class="text-xs text-gray-400 mt-1">
              {{ formatDistance(result.distance) }} away
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No results message -->
    <div
      v-if="showResults && query.length >= 2 && results.length === 0 && !loading"
      class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 px-4 py-6"
    >
      <div class="text-sm text-gray-500 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        No addresses found for "{{ query }}"
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import autocompleteService from '@/services/autocomplete.service';
import type { PlaceResult } from '@/types/address.types';

interface Props {
  modelValue?: string;
  placeholder?: string;
  type: 'pickup' | 'destination';
  userLocation?: { lat: number; lng: number } | null;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'addressSelected', address: PlaceResult): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Enter address...'
});

const emit = defineEmits<Emits>();

// Reactive state
const query = ref(props.modelValue);
const results = ref<PlaceResult[]>([]);
const loading = ref(false);
const focused = ref(false);
const showResults = ref(false);
const selectedIndex = ref(-1);
const inputRef = ref<HTMLInputElement | null>(null);

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== query.value) {
      query.value = newValue;
    }
  }
);

// Watch query changes
watch(query, (newQuery) => {
  emit('update:modelValue', newQuery);
  if (newQuery.length >= 2) {
    searchAddresses(newQuery);
  } else {
    results.value = [];
    showResults.value = false;
  }
});

// Methods
const handleInput = () => {
  selectedIndex.value = -1;
  showResults.value = true;
};

const handleFocus = () => {
  focused.value = true;
  showResults.value = query.value.length >= 2 && results.value.length > 0;
  emit('focus');
};

const handleBlur = () => {
  focused.value = false;
  // Delay hiding results to allow for click events
  setTimeout(() => {
    showResults.value = false;
  }, 200);
  emit('blur');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!showResults.value || results.value.length === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0 && selectedIndex.value < results.value.length) {
        selectResult(results.value[selectedIndex.value]);
      }
      break;
    case 'Escape':
      event.preventDefault();
      showResults.value = false;
      inputRef.value?.blur();
      break;
  }
};

const searchAddresses = async (searchQuery: string) => {
  try {
    loading.value = true;
    const searchResults = await autocompleteService.searchPlaces(
      searchQuery,
      props.userLocation || undefined,
      `${props.type}-autocomplete`
    );
    results.value = searchResults;
    showResults.value = searchResults.length > 0;
  } catch (error) {
    console.error('Address search error:', error);
    results.value = [];
    showResults.value = false;
  } finally {
    loading.value = false;
  }
};

const selectResult = (result: PlaceResult) => {
  query.value = result.address.label;
  showResults.value = false;
  selectedIndex.value = -1;
  emit('addressSelected', result);

  // Focus next input if this is pickup
  if (props.type === 'pickup') {
    nextTick(() => {
      // Try to focus the destination input
      const destinationInput = document.querySelector('input[placeholder*="Drop-off"]') as HTMLInputElement;
      if (destinationInput) {
        destinationInput.focus();
      }
    });
  }
};

const formatDistance = (meters: number): string => {
  return autocompleteService.formatDistance(meters);
};

// Focus method for external use
const focus = () => {
  inputRef.value?.focus();
};

// Clear method
const clear = () => {
  query.value = '';
  results.value = [];
  showResults.value = false;
};

// Expose methods
defineExpose({
  focus,
  clear
});

// Handle clicks outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const container = inputRef.value?.closest('.relative');
  if (container && !container.contains(target)) {
    showResults.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Ensure dropdown appears above everything */
.z-50 {
  z-index: 50;
}

/* Smooth scrolling for results */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
