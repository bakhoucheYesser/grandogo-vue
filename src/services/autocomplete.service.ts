// src/services/autocomplete.service.ts
import apiClient from '@/services/api';
import type { PlaceResult, RouteResult } from '@/types/address.types';

class AutocompleteService {
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private cache: Map<string, PlaceResult[]> = new Map();
  private lastRequestTime: Map<string, number> = new Map();
  private readonly MIN_REQUEST_INTERVAL = 500; // Minimum 500ms entre les requêtes
  private readonly DEBOUNCE_DELAY = 600; // Augmenté pour réduire les requêtes

  async searchPlaces(
    query: string,
    userLocation?: { lat: number; lng: number },
    debounceKey = 'default'
  ): Promise<PlaceResult[]> {
    return new Promise((resolve) => {
      // Return empty if query too short
      if (query.length < 2) {
        resolve([]);
        return;
      }

      // Check cache first
      const cacheKey = `${query}-${userLocation?.lat}-${userLocation?.lng}`;
      if (this.cache.has(cacheKey)) {
        console.log('📦 Cache hit for:', query);
        resolve(this.cache.get(cacheKey)!);
        return;
      }

      // Check rate limiting
      const lastRequest = this.lastRequestTime.get(debounceKey) || 0;
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequest;

      // Clear existing debounce timer
      const existingTimer = this.debounceTimers.get(debounceKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Calculate delay based on rate limiting
      let delay = this.DEBOUNCE_DELAY;
      if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
        delay = Math.max(delay, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest + 100);
      }

      console.log(`⏱️  Debouncing search for "${query}" with delay: ${delay}ms`);

      // Set new debounce timer
      const timer = setTimeout(async () => {
        try {
          // Update last request time
          this.lastRequestTime.set(debounceKey, Date.now());

          console.log('🔍 Executing search for:', query);

          // Try API first
          const results = await this.searchWithAPI(query, userLocation);

          if (results.length > 0) {
            this.cache.set(cacheKey, results);
            resolve(results);
          } else {
            // Fallback to mock data if API returns empty
            const mockResults = this.generateMockResults(query);
            resolve(mockResults);
          }
        } catch (error) {
          console.warn('API search failed, using mock data:', error);
          const mockResults = this.generateMockResults(query);
          resolve(mockResults);
        } finally {
          this.debounceTimers.delete(debounceKey);
        }
      }, delay);

      this.debounceTimers.set(debounceKey, timer);
    });
  }

  private async searchWithAPI(
    query: string,
    userLocation?: { lat: number; lng: number }
  ): Promise<PlaceResult[]> {
    const params = new URLSearchParams({
      q: query,
      limit: '5',
      ...(userLocation && {
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString()
      })
    });

    console.log('📡 Making API call for:', query);

    // Ajouter un retry mechanism simple
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const response = await apiClient.get(`/geocoding/search?${params}`);

        if (response.data.items) {
          return response.data.items.map((item: any) => ({
            id: item.id || Math.random().toString(),
            title: item.title || item.address?.label || 'Unknown location',
            address: {
              label: item.address?.label || item.title || 'Unknown address',
              countryCode: item.address?.countryCode || 'CA',
              city: item.address?.city,
              state: item.address?.state,
              postalCode: item.address?.postalCode
            },
            position: {
              lat: item.position?.lat || 45.5017,
              lng: item.position?.lng || -73.5673
            },
            resultType: item.resultType || 'place',
            distance: item.distance
          }));
        }

        return [];

      } catch (error: any) {
        if (error.response?.status === 429 && retryCount < maxRetries) {
          // Rate limited - wait before retry
          retryCount++;
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`⏳ Rate limited, retrying in ${waitTime}ms (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          throw error;
        }
      }
    }

    return [];
  }

  private generateMockResults(query: string): PlaceResult[] {
    // Generate mock results based on common Quebec locations
    const mockLocations = [
      {
        id: `mock-1-${Date.now()}`,
        title: `${query} - Montreal, QC`,
        address: {
          label: `${query}, Montreal, QC, Canada`,
          countryCode: 'CA',
          city: 'Montreal',
          state: 'Quebec',
          postalCode: 'H3A 0G4'
        },
        position: { lat: 45.5017 + Math.random() * 0.1, lng: -73.5673 + Math.random() * 0.1 },
        resultType: 'address'
      },
      {
        id: `mock-2-${Date.now()}`,
        title: `${query} - Quebec City, QC`,
        address: {
          label: `${query}, Quebec City, QC, Canada`,
          countryCode: 'CA',
          city: 'Quebec City',
          state: 'Quebec',
          postalCode: 'G1R 2L3'
        },
        position: { lat: 46.8139 + Math.random() * 0.1, lng: -71.2080 + Math.random() * 0.1 },
        resultType: 'address'
      }
    ];

    return mockLocations.slice(0, 2);
  }

  // Méthode pour nettoyer les timers en cas de changement rapide de composant
  cancelPendingRequests(debounceKey?: string): void {
    if (debounceKey) {
      const timer = this.debounceTimers.get(debounceKey);
      if (timer) {
        clearTimeout(timer);
        this.debounceTimers.delete(debounceKey);
      }
    } else {
      // Cancel all pending requests
      this.debounceTimers.forEach(timer => clearTimeout(timer));
      this.debounceTimers.clear();
    }
  }

  async calculateRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<RouteResult | null> {
    try {
      const response = await apiClient.post('/geocoding/route', {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`
      });

      if (response.data.routes && response.data.routes.length > 0) {
        return response.data.routes[0];
      }

      return this.calculateMockRoute(origin, destination);
    } catch (error) {
      console.warn('Route calculation failed, using mock route:', error);
      return this.calculateMockRoute(origin, destination);
    }
  }

  private calculateMockRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): RouteResult {
    const R = 6371;
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLng = (destination.lng - origin.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000;

    const duration = (distance / 1000) * 90;

    return {
      summary: {
        duration: Math.round(duration),
        length: Math.round(distance)
      },
      polyline: ''
    };
  }

  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve({ lat: 45.5017, lng: -73.5673 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  clearCache(): void {
    this.cache.clear();
    this.lastRequestTime.clear();
  }
}

export default new AutocompleteService();
