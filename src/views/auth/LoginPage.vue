<template>
  <section class="mt-8 mb-12 flex justify-center">
    <div class="w-full bg-white rounded-lg shadow-md border border-gray-200 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h3 class="mb-3 text-4xl font-extrabold text-blue-700 text-center">Sign In</h3>

        <form class="space-y-4 md:space-y-6" @submit.prevent="handleSubmit">
          <!-- Error -->
          <div v-if="error"
               class="p-4 mb-4 text-sm text-red-600 rounded-lg bg-red-50"
               role="alert">
            {{ error }}
          </div>
          <!-- Email -->
          <div>
            <label for="email"
                   class="block mb-2 text-sm font-medium text-blue-700">Your email</label>
            <input type="email" id="email" v-model="email" required
                   class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                   placeholder="name@example.com">
          </div>

          <!-- Password -->
          <div>
            <label for="password"
                   class="block mb-2 text-sm font-medium text-blue-700">Password</label>
            <input type="password" id="password" v-model="password" required
                   class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                   placeholder="••••••••">
          </div>

          <!-- Submit -->
          <div class="flex justify-center">
            <button type="submit" :disabled="loading"
                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-1/2">
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
          </div>

          <!-- Separator -->
          <div class="flex justify-center items-center mb-3">
            <div class="flex-grow border-t border-gray-300"></div>
            <p class="mx-4 text-blue-600 text-center">or</p>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>
          <!-- Google button -->
          <button type="button"
                  class="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-blue-100">
            <img class="h-5 mr-2"
                 src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                 alt="">
            <span class="text-center">Sign in with Google</span>
          </button>

          <!-- Footer -->
          <p class="text-sm font-light text-gray-600 text-center">
            Don't have an account yet?
            <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Sign up
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.ts';


const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Form state
const email = ref<string>('');
const password = ref<string>('');
const loading = ref<boolean>(false);
const error = ref<string>('');

// Form submission handler
const handleSubmit = async (): Promise<void> => {
  try {
    error.value = '';
    loading.value = true;

    await authStore.login({
      email: email.value,
      password: password.value,
    });

    // Redirect to the original requested page or home
    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath);
  } catch (err) {
    console.error('Login error:', err);
    // Handle specific API error responses
    if (err.response) {
      error.value = err.response.data.message || 'Authentication failed. Please check your credentials.';
    } else {
      error.value = 'Cannot connect to the server. Please try again later.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
