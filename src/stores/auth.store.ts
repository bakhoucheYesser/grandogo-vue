import { defineStore } from 'pinia';
import axios from 'axios';
import router from '../router';
import { ref, computed } from 'vue';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth.types';

interface AuthResponse {
  statusCode: number;
  data: {
    message: string;
    user: User;
  }
}


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

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
      const response = await api.post<AuthResponse>('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      // Set authentication data - Noter que la structure a changé
      setAuthData(response.data);

      // Redirect based on user type
      if (user.value) {
        switch (user.value.userType) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'provider':
            router.push('/provider/dashboard');
            break;
          case 'customer':
            router.push('/customer/dashboard');
            break;
          default:
            router.push('/');
        }
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      const response = await api.post<AuthResponse>('/provider/register', {
        ...credentials
      });

      setAuthData(response.data);

      // Redirect to appropriate dashboard or onboarding
      router.push('/onboarding');

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async function refreshAccessToken() {
    try {
      const response = await api.get<AuthResponse>('/auth/refresh');
      setAuthData(response.data);
      return response.data;
    } catch (error) {
      // If refresh fails, logout the user
      logout();
      throw error;
    }
  }

  function logout() {
    // Appeler l'API pour se déconnecter
    api.post('/auth/logout').catch(error => console.error('Logout error:', error));

    // Clear authentication data
    user.value = null;

    // Remove from local storage
    localStorage.removeItem('user');

    // Redirect to login page
    router.push('/login');
  }

  function setAuthData(data: AuthResponse) {
    user.value = data.data.user;
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If token has expired and we haven't tried to refresh yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          await refreshAccessToken();

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

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
    setAuthData
  };
});
