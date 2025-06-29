<template>
  <header class="mt-4">
    <div class="container mx-auto  ">
      <div class="flex justify-between items-center py-2">
        <!-- Logo and tagline -->
        <div class="flex items-center space-x-2">
          <router-link to="/" class="flex items-center"><span class=" text-base font-bold text-black">On-demand movers</span></router-link>

        </div>

        <!-- Navigation menu -->
        <nav class="hidden md:flex space-x-6">
          <!-- Services dropdown -->
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
                    <router-link to="#" class="flex items-center text-gray-800 hover:text-green-800 group transition-all duration-300 ease-in-out">
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
                    <router-link to="#" class="flex items-center text-gray-800 hover:text-red-800 group transition-all duration-300 ease-in-out">
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
                    <router-link to="#" class="flex items-center text-gray-800 hover:text-purple-800 group transition-all duration-300 ease-in-out">
                      <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-100 shadow-sm group-hover:bg-purple-200 group-hover:shadow-md transition-all duration-300 relative mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-purple-600 group-hover:text-purple-700 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </span>
                      <span class="font-medium">College Moving</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="#" class="flex items-center text-gray-800 hover:text-yellow-800 group transition-all duration-300 ease-in-out">
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
                    <router-link to="#" class="flex items-center text-gray-800 hover:text-blue-800 group transition-all duration-300 ease-in-out">
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
                    <router-link to="#" class="flex items-center text-gray-800 hover:text-orange-800 group transition-all duration-300 ease-in-out">
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
                    <router-link to="#" class="flex items-center text-gray-800 hover:text-teal-800 group transition-all duration-300 ease-in-out">
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

          <router-link
            to="/estimate"
            class="text-slate-800 hover:text-red-700 font-semibold text-base transition-colors duration-200"
          >
            GET ESTIMATE
          </router-link>

          <router-link
            to="/cities"
            class="text-slate-800 hover:text-red-700 font-semibold text-base transition-colors duration-200"          >
            CITIES
          </router-link>

          <router-link
            to="/become-driver"
            class="text-slate-800 hover:text-red-700 font-semibold text-base transition-colors duration-200"          >
            BECOME A GRANDODRIVER
          </router-link>
        </nav>

        <!-- User authentication section -->
        <div class="flex items-center space-x-3">
          <template v-if="isAuthenticated">
            <router-link to="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</router-link>
            <div class="relative">
              <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                <span>{{ user.firstName }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="userMenuOpen" @click.outside="userMenuOpen = false" class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <router-link to="/profile" class="block px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50">Profile</router-link>
                <a href="#" @click.prevent="logout" class="block px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50">Logout</a>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-4">
              <router-link to="/login" class=" font-semibold flex items-center gap-1 text-black hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" class="w-[16px] font-semibold ">
                  <path fill="currentColor" fill-rule="evenodd" d="M10 3.333a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m-4.167 2.5a4.167 4.167 0 1 1 8.334 0 4.167 4.167 0 0 1-8.334 0M5.07 16.667h9.862a5.001 5.001 0 0 0-9.862 0m-1.736.833a6.667 6.667 0 0 1 13.334 0c0 .46-.373.833-.834.833H4.167a.833.833 0 0 1-.834-.833" clip-rule="evenodd" />
                </svg>
                <span>Sign In</span>
              </router-link>

              <router-link to="/register"   class="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm  px-3.5 py-3 gap-x-4 flex-wrap justify-center"
              >Book Now</router-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.ts';
import { onClickOutside, onKeyStroke } from '@vueuse/core';

const servicesOpen = ref(false);
const userMenuOpen = ref(false);
const dropdownRef = ref(null);

// Auth store
const authStore = useAuthStore();
const router = useRouter();

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

// Click outside dropdown
onClickOutside(dropdownRef, () => {
  servicesOpen.value = false;
});

// ESC to close
onKeyStroke('Escape', () => {
  servicesOpen.value = false;
  userMenuOpen.value = false;
});

// Logout
const logout = async () => {
  await authStore.logout();
  userMenuOpen.value = false;
  router.push('/login');
};
</script>

<style scoped>
.btn-primary {
  @apply bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm w-full px-3.5 py-3 gap-x-4 flex-wrap justify-center;
}

[v-cloak] {
  display: none;
}
</style>
