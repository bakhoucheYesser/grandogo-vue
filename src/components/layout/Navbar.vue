<template>
  <header class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="text-2xl font-black text-gray-900">GrandoGo</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <!-- Services Dropdown -->
          <div class="relative" ref="servicesDropdown">
            <button
              @click="toggleServices"
              class="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200"
            >
              <span>Services</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform duration-200"
                :class="{ 'rotate-180': servicesOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Services Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="servicesOpen"
                class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 p-6 z-50"
              >
                <div class="relative" ref="dropdownRef">
                  <button @click="servicesOpen = !servicesOpen" class="text-slate-800 hover:text-red-700 font-semibold text-base transition-colors duration-200">
                    SERVICES
                  </button>

                  <div
                    v-show="servicesOpen"
                    class="absolute top-full left-0 mt-1 w-[600px] bg-white rounded-lg shadow-xl border border-blue-100 p-4 grid grid-cols-2 gap-4 z-50 items-stretch"
                    v-cloak
                  >
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-2">Moving Services</h3>
                      <ul class="space-y-2">
                        <li>
                          <router-link to="/estimate" class="flex items-center text-gray-800 hover:text-green-800 group transition-all duration-300 ease-in-out">
                      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-100 shadow-sm group-hover:bg-green-200 group-hover:shadow-md transition-all duration-300 relative mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600 group-hover:text-green-700 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </span>
                            <span class="font-medium">Home Moving</span>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/estimate" class="flex items-center text-gray-800 hover:text-red-800 group transition-all duration-300 ease-in-out">
                      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-100 shadow-sm group-hover:bg-red-200 group-hover:shadow-md transition-all duration-300 relative mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600 group-hover:text-red-700 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                        </svg>
                      </span>
                            <span class="font-medium">Apartment Moving</span>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/estimate" class="flex items-center text-gray-800 hover:text-purple-800 group transition-all duration-300 ease-in-out">
                      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-100 shadow-sm group-hover:bg-purple-200 group-hover:shadow-md transition-all duration-300 relative mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-600 group-hover:text-purple-700 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </span>
                            <span class="font-medium">College Moving</span>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/estimate" class="flex items-center text-gray-800 hover:text-yellow-800 group transition-all duration-300 ease-in-out">
                      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 shadow-sm group-hover:bg-yellow-200 group-hover:shadow-md transition-all duration-300 relative mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-600 group-hover:text-yellow-700 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      </span>
                            <span class="font-medium">Storage Moving</span>
                          </router-link>
                        </li>
                      </ul>
                    </div>

                    <!-- Column 2 -->
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-2">Other Services</h3>
                      <ul class="space-y-2">
                        <li>
                          <router-link to="/estimate" class="flex items-center text-gray-800 hover:text-blue-800 group transition-all duration-300 ease-in-out">
                      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 shadow-sm group-hover:bg-blue-200 group-hover:shadow-md transition-all duration-300 relative mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600 group-hover:text-blue-700 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                          <rect x="9" y="9" width="6" height="6"></rect>
                        </svg>
                      </span>
                            <span class="font-medium">Office Moving</span>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/estimate" class="flex items-center text-gray-800 hover:text-orange-800 group transition-all duration-300 ease-in-out">
                      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 shadow-sm group-hover:bg-orange-200 group-hover:shadow-md transition-all duration-300 relative mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-600 group-hover:text-orange-700 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                      </span>
                            <span class="font-medium">Furniture Delivery</span>
                          </router-link>
                        </li>
                        <li>
                          <router-link to="/estimate" class="flex items-center text-gray-800 hover:text-teal-800 group transition-all duration-300 ease-in-out">
                      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-teal-100 shadow-sm group-hover:bg-teal-200 group-hover:shadow-md transition-all duration-300 relative mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-teal-600 group-hover:text-teal-700 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </span>
                            <span class="font-medium">Donation Pick Up</span>
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Other Navigation Links -->
          <router-link
            to="/estimate"
            class="text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200"
          >
            Get Estimate
          </router-link>

          <router-link
            to="/cities"
            class="text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200"
          >
            Cities
          </router-link>

          <router-link
            to="/become-driver"
            class="text-gray-700 hover:text-red-600 font-semibold transition-colors duration-200"
          >
            Become a Driver
          </router-link>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <!-- Authentication Section -->
          <div v-if="isAuthenticated" class="flex items-center space-x-4">
            <router-link
              to="/dashboard"
              class="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
            >
              Dashboard
            </router-link>

            <!-- User Menu Dropdown -->
            <div class="relative" ref="userDropdown">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span class="text-red-600 font-semibold text-sm">
                    {{ userInitials }}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transition-transform duration-200"
                  :class="{ 'rotate-180': userMenuOpen }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- User Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="userMenuOpen"
                  class="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                >
                  <router-link
                    to="/dashboard"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    @click="closeDropdowns"
                  >
                    Dashboard
                  </router-link>
                  <router-link
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    @click="closeDropdowns"
                  >
                    Profile
                  </router-link>
                  <hr class="my-1 border-gray-100">
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Guest Actions -->
          <div v-else class="flex items-center space-x-4">
            <router-link
              to="/login"
              class="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Sign In</span>
            </router-link>

            <router-link
              to="/estimate"
              class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Book Now
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-100 py-4">
          <div class="space-y-2">
            <router-link
              to="/estimate"
              class="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg mx-4 transition-colors"
              @click="closeMobileMenu"
            >
              Get Estimate
            </router-link>
            <router-link
              to="/cities"
              class="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg mx-4 transition-colors"
              @click="closeMobileMenu"
            >
              Cities
            </router-link>
            <router-link
              to="/become-driver"
              class="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg mx-4 transition-colors"
              @click="closeMobileMenu"
            >
              Become a Driver
            </router-link>

            <hr class="my-2 border-gray-100">

            <div v-if="isAuthenticated" class="px-4 space-y-2">
              <router-link
                to="/dashboard"
                class="block py-2 text-gray-700 hover:text-red-600 transition-colors"
                @click="closeMobileMenu"
              >
                Dashboard
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>

            <div v-else class="px-4 space-y-2">
              <router-link
                to="/login"
                class="block py-2 text-gray-700 hover:text-red-600 transition-colors"
                @click="closeMobileMenu"
              >
                Sign In
              </router-link>
              <router-link
                to="/estimate"
                class="block bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300"
                @click="closeMobileMenu"
              >
                Book Now
              </router-link>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

// Dropdown states
const servicesOpen = ref(false);
const userMenuOpen = ref(false);
const mobileMenuOpen = ref(false);

// Refs for click outside detection
const servicesDropdown = ref<HTMLElement | null>(null);
const userDropdown = ref<HTMLElement | null>(null);

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const userInitials = computed(() => {
  if (!user.value) return '';
  const firstName = user.value.firstName || '';
  const lastName = user.value.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
});

// Methods
const toggleServices = () => {
  servicesOpen.value = !servicesOpen.value;
  userMenuOpen.value = false;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
  servicesOpen.value = false;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  closeDropdowns();
};

const closeDropdowns = () => {
  servicesOpen.value = false;
  userMenuOpen.value = false;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  closeDropdowns();
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    closeDropdowns();
    closeMobileMenu();
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  if (servicesDropdown.value && !servicesDropdown.value.contains(target)) {
    servicesOpen.value = false;
  }

  if (userDropdown.value && !userDropdown.value.contains(target)) {
    userMenuOpen.value = false;
  }
};

// Escape key handler
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdowns();
    closeMobileMenu();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
});
</script>




