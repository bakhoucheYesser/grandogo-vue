<template>
  <div class="relative w-full" ref="containerRef">
    <!-- Input Container avec design amélioré -->
    <div class="relative">
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="w-full text-base font-medium text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 pr-10"
        :class="{
          'border-b-2 border-red-200': showResults && results.length > 0,
          'border-b border-gray-200': !showResults || results.length === 0
        }"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        autocomplete="off"
        spellcheck="false"
      />

      <!-- Loading/Search Icon -->
      <div class="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center">
        <div v-if="loading" class="animate-spin">
          <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="query.length >= 2" class="text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <div v-else class="text-gray-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Dropdown Portal Container -->
    <Teleport to="body">
      <div
        v-if="showResults && (results.length > 0 || (query.length >= 2 && !loading))"
        ref="dropdownRef"
        class="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-100 backdrop-blur-sm min-w-[350px] sm:min-w-[400px] md:min-w-[450px]"
        :class="dropdownClasses"
        :style="dropdownStyles"
      >
        <!-- Dropdown Arrow -->
        <div
          class="absolute w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"
          :class="arrowClasses"
          :style="arrowStyles"
        ></div>

        <!-- Loading State -->
        <div v-if="loading" class="p-6 text-center">
          <div class="flex items-center justify-center space-x-3">
            <div class="animate-spin">
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <span class="text-sm text-gray-600 font-medium">Searching addresses...</span>
          </div>
        </div>

        <!-- Results List -->
        <div v-else-if="results.length > 0" class="max-h-80 overflow-y-auto custom-scrollbar">
          <!-- Search Query Info -->
          <div class="px-4 py-2 border-b border-gray-50 bg-gray-25">
            <div class="flex items-center text-xs text-gray-500">
              <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span>{{ results.length }} result{{ results.length > 1 ? 's' : '' }} for "{{ query }}"</span>
            </div>
          </div>

          <!-- Address Results -->
          <div class="py-2">
            <div
              v-for="(result, index) in results"
              :key="result.id"
              class="group relative px-4 py-3 cursor-pointer transition-all duration-150 ease-out"
              :class="{
                'bg-red-50 border-l-4 border-red-400': selectedIndex === index,
                'hover:bg-gray-50': selectedIndex !== index
              }"
              @click="selectResult(result)"
              @mouseenter="selectedIndex = index"
              @mouseleave="hoveredIndex = -1"
            >
              <!-- Result Content -->
              <div class="flex items-start space-x-3">
                <!-- Location Icon -->
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150"
                    :class="{
                      'bg-red-100': selectedIndex === index,
                      'bg-gray-100 group-hover:bg-red-50': selectedIndex !== index
                    }"
                  >
                    <svg
                      class="w-4 h-4 transition-colors duration-150"
                      :class="{
                        'text-red-600': selectedIndex === index,
                        'text-gray-500 group-hover:text-red-400': selectedIndex !== index
                      }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                <!-- Address Info -->
                <div class="flex-1 min-w-0">
                  <!-- Main Title -->
                  <div
                    class="font-semibold text-gray-900 truncate transition-colors duration-150"
                    :class="{
                      'text-red-700': selectedIndex === index
                    }"
                  >
                    {{ result.title }}
                  </div>

                  <!-- Full Address -->
                  <div class="text-sm text-gray-600 mt-1 line-clamp-2">
                    {{ result.address.label }}
                  </div>

                  <!-- Additional Info -->
                  <div class="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                    <div v-if="result.address.city" class="flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      {{ result.address.city }}
                    </div>
                    <div v-if="result.address.state" class="flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                      {{ result.address.state }}
                    </div>
                    <div v-if="result.distance" class="flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                      {{ formatDistance(result.distance) }}
                    </div>
                  </div>
                </div>

                <!-- Selection Indicator -->
                <div
                  class="flex-shrink-0 mt-1 transition-all duration-150"
                  :class="{
                    'opacity-100 scale-100': selectedIndex === index,
                    'opacity-0 scale-75': selectedIndex !== index
                  }"
                >
                  <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Info -->
          <div class="px-4 py-2 border-t border-gray-50 bg-gray-25">
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span v-if="userLocation">📍 Near you</span>
            </div>
          </div>
        </div>

        <!-- No Results State -->
        <div v-else class="p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 mb-1">No addresses found</h3>
          <p class="text-sm text-gray-500">Try adjusting your search terms for "{{ query }}"</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue';
import type { PlaceResult } from '@/types/address.types';
import AutocompleteService from '@/services/autocomplete.service';

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
const hoveredIndex = ref(-1);
const inputRef = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);

// Dropdown positioning
const dropdownPosition = ref({ top: 0, left: 0, width: 0 });
const dropdownDirection = ref<'down' | 'up'>('down');

// Computed debounce key
const debounceKey = computed(() => `${props.type}-autocomplete`);

// Dropdown positioning computed properties
const dropdownStyles = computed(() => ({
  top: `${dropdownPosition.value.top}px`,
  left: `${dropdownPosition.value.left}px`,
  width: `${dropdownPosition.value.width}px`,
  transformOrigin: dropdownDirection.value === 'down' ? 'top center' : 'bottom center'
}));

const dropdownClasses = computed(() => ({
  'animate-in fade-in-0 zoom-in-95 duration-200': showResults.value,
  'animate-out fade-out-0 zoom-out-95 duration-150': !showResults.value
}));

const arrowClasses = computed(() => ({
  'top-[-6px]': dropdownDirection.value === 'down',
  'bottom-[-6px] rotate-[225deg]': dropdownDirection.value === 'up'
}));

const arrowStyles = computed(() => ({
  left: '20px'
}));

// Calculate dropdown position
const calculateDropdownPosition = () => {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const dropdownHeight = 320; // Max height estimate
  const padding = 16;

  // Check if there's enough space below
  const spaceBelow = viewportHeight - rect.bottom - padding;
  const spaceAbove = rect.top - padding;

  let direction: 'down' | 'up' = 'down';
  let top = rect.bottom + 8; // 8px gap

  if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
    direction = 'up';
    top = rect.top - 8; // 8px gap above
  }

  dropdownDirection.value = direction;
  dropdownPosition.value = {
    top: direction === 'up' ? top - dropdownHeight : top,
    left: rect.left,
    width: rect.width
  };
};

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
    loading.value = false;
  }
});

// Watch showResults to recalculate position
watch(showResults, (show) => {
  if (show) {
    nextTick(() => {
      calculateDropdownPosition();
    });
  }
});

// Methods
const handleInput = () => {
  selectedIndex.value = -1;
  hoveredIndex.value = -1;
  showResults.value = true;
};

const handleFocus = () => {
  focused.value = true;
  showResults.value = query.value.length >= 2 && (results.value.length > 0 || loading.value);
  emit('focus');

  nextTick(() => {
    calculateDropdownPosition();
  });
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
  if (!showResults.value || (results.value.length === 0 && !loading.value)) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (results.value.length > 0) {
        selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1);
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (results.value.length > 0) {
        selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      }
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
    case 'Tab':
      showResults.value = false;
      break;
  }
};

const searchAddresses = async (searchQuery: string) => {
  try {
    loading.value = true;
    showResults.value = true;

    const searchResults = await AutocompleteService.searchPlaces(
      searchQuery,
      props.userLocation || undefined,
      debounceKey.value
    );

    if (query.value === searchQuery) {
      results.value = searchResults;
      showResults.value = true;

      nextTick(() => {
        calculateDropdownPosition();
      });
    }

  } catch (error) {
    console.error('Address search error:', error);
    if (query.value === searchQuery) {
      results.value = [];
      showResults.value = false;
    }
  } finally {
    if (query.value === searchQuery) {
      loading.value = false;
    }
  }
};

const selectResult = (result: PlaceResult) => {
  query.value = result.address.label;
  showResults.value = false;
  selectedIndex.value = -1;
  hoveredIndex.value = -1;
  loading.value = false;
  emit('addressSelected', result);

  // Focus next input if this is pickup
  if (props.type === 'pickup') {
    nextTick(() => {
      const destinationInput = document.querySelector('[data-address-type="destination"] input') as HTMLInputElement;
      if (destinationInput) {
        destinationInput.focus();
      }
    });
  }
};

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Focus method for external use
const focus = () => {
  inputRef.value?.focus();
};

// Expose methods
defineExpose({
  focus
});

// Handle clicks outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  // Check if click is inside the container or dropdown
  const isInsideContainer = containerRef.value?.contains(target);
  const isInsideDropdown = dropdownRef.value?.contains(target);

  if (!isInsideContainer && !isInsideDropdown) {
    showResults.value = false;
  }
};

// Handle window resize
const handleResize = () => {
  if (showResults.value) {
    calculateDropdownPosition();
  }
};

// Handle scroll
const handleScroll = () => {
  if (showResults.value) {
    calculateDropdownPosition();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleScroll, true);
  AutocompleteService.cancelPendingRequests(debounceKey.value);
});
</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom animations */
@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes animate-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-4px) scale(0.95);
  }
}

.animate-in {
  animation: animate-in 0.2s ease-out forwards;
}

.animate-out {
  animation: animate-out 0.15s ease-in forwards;
}
</style>
