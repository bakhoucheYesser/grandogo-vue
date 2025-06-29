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

          <!-- Success Message -->
          <div v-if="successMessage"
               class="p-4 mb-4 text-sm text-green-600 rounded-lg bg-green-50"
               role="alert">
            {{ successMessage }}
          </div>

          <!-- Email -->
          <div>
            <label for="email"
                   class="block mb-2 text-sm font-medium text-blue-700">Your email</label>
            <input type="email" id="email" v-model="email" required
                   :disabled="loading"
                   class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50"
                   placeholder="name@example.com">
          </div>

          <!-- Password -->
          <div>
            <label for="password"
                   class="block mb-2 text-sm font-medium text-blue-700">Password</label>
            <input type="password" id="password" v-model="password" required
                   :disabled="loading"
                   class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50"
                   placeholder="••••••••">
          </div>

          <!-- Submit -->
          <div class="flex justify-center">
            <button type="submit" :disabled="loading"
                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
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
                  disabled
                  class="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-gray-400 bg-gray-100 cursor-not-allowed">
            <img class="h-5 mr-2 opacity-50"
                 src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                 alt="">
            <span class="text-center">Sign in with Google (Coming Soon)</span>
          </button>

          <!-- Footer -->
          <p class="text-sm font-light text-gray-600 text-center">
            Don't have an account yet?
            <router-link to="/become-driver" class="font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Sign up as Driver
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
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Form state
const email = ref<string>('');
const password = ref<string>('');
const loading = ref<boolean>(false);
const error = ref<string>('');
const successMessage = ref<string>('');

// Form submission handler
const handleSubmit = async (): Promise<void> => {
  try {
    error.value = '';
    successMessage.value = '';
    loading.value = true;

    await authStore.login({
      email: email.value,
      password: password.value,
    });

    // Show success message briefly
    successMessage.value = 'Login successful! Redirecting...';

    // Redirect after a short delay to show the success message
    setTimeout(() => {
      const redirectPath = route.query.redirect as string || '/';
      console.log('🔄 Redirecting to:', redirectPath);
      router.push(redirectPath);
    }, 1000);

  } catch (err: any) {
    console.error('Login error:', err);

    // Handle specific API error responses
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.message) {
      error.value = err.message;
    } else {
      error.value = 'Authentication failed. Please check your credentials.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
