import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/services/api';
import toastService from '@/services/toast.service';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth.types';

// Updated interface to match actual backend response
interface AuthResponse {
  user: User;
  message?: string;
}

// Alternative response structure (in case backend sends nested data)
interface AuthResponseNested {
  data: {
    user: User;
    message?: string;
  };
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null
  );

  // Getters
  const isAuthenticated = computed((): boolean => !!user.value);
  const isAdmin = computed((): boolean =>
    user.value?.userType === 'admin' || false
  );
  const isProvider = computed((): boolean =>
    user.value?.userType === 'provider' || false
  );
  const isCustomer = computed((): boolean =>
    user.value?.userType === 'customer' || false
  );

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      console.log('🔐 Attempting login for:', credentials.email);

      const response = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      console.log('✅ Login response:', response.data);

      // Handle different response structures
      let userData: User;

      if (response.data.user) {
        // Direct structure: {user: {...}}
        userData = response.data.user;
      } else if (response.data.data && response.data.data.user) {
        // Nested structure: {data: {user: {...}}}
        userData = response.data.data.user;
      } else {
        throw new Error('Invalid response structure: user data not found');
      }

      // Set authentication data
      setAuthData(userData);
      toastService.success('Login successful!');

      console.log('✅ Login successful for user:', userData.email);

      return response.data;
    } catch (error: any) {
      console.error('❌ Login error:', error);

      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toastService.error(errorMessage);
      throw error;
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      console.log('📝 Attempting registration for:', credentials.email);

      const response = await apiClient.post('/provider/register', {
        ...credentials
      });

      // Handle different response structures for registration too
      let userData: User;

      if (response.data.user) {
        userData = response.data.user;
      } else if (response.data.data && response.data.data.user) {
        userData = response.data.data.user;
      } else {
        throw new Error('Invalid response structure: user data not found');
      }

      setAuthData(userData);
      toastService.success('Registration successful!');

      console.log('✅ Registration successful for user:', userData.email);

      return response.data;
    } catch (error: any) {
      console.error('❌ Registration error:', error);

      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toastService.error(errorMessage);
      throw error;
    }
  }

  async function refreshAccessToken() {
    try {
      console.log('🔄 Refreshing authentication token');

      const response = await apiClient.post('/auth/refresh');

      // Handle different response structures
      let userData: User;

      if (response.data.user) {
        userData = response.data.user;
      } else if (response.data.data && response.data.data.user) {
        userData = response.data.data.user;
      } else {
        throw new Error('Invalid response structure: user data not found');
      }

      setAuthData(userData);
      console.log('✅ Token refreshed successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      logout();
      throw error;
    }
  }

  async function fetchCurrentUser() {
    try {
      console.log('👤 Fetching current user profile');

      const response = await apiClient.get('/auth/me');

      // Handle different response structures
      let userData: User;

      if (response.data.user) {
        userData = response.data.user;
      } else if (response.data.data && response.data.data.user) {
        userData = response.data.data.user;
      } else {
        throw new Error('Invalid response structure: user data not found');
      }

      setAuthData(userData);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch current user:', error);
      logout();
      throw error;
    }
  }

  function logout() {
    // Call the API to logout
    apiClient.post('/auth/logout').catch(error => console.error('Logout error:', error));

    // Clear authentication data
    user.value = null;

    // Remove from local storage
    localStorage.removeItem('user');

    toastService.success('Logged out successfully');
    console.log('🚪 User logged out');
  }

  function setAuthData(userData: User) {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('💾 Auth data saved for user:', userData.email);
  }

  return {
    // State
    user,

    // Computed
    isAuthenticated,
    isAdmin,
    isProvider,
    isCustomer,

    // Methods
    login,
    register,
    logout,
    refreshAccessToken,
    fetchCurrentUser,
    setAuthData
  };
});
