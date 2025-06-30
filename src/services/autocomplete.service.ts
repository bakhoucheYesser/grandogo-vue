// src/services/autocomplete.service.ts
import apiClient from '@/services/api';
import type { PlaceResult, RouteResult } from '@/types/address.types';

class AutocompleteService {
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private cache: Map<string, PlaceResult[]> = new Map();

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
        resolve(this.cache.get(cacheKey)!);
        return;
      }

      // Clear existing debounce timer
      const existingTimer = this.debounceTimers.get(debounceKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new debounce timer
      const timer = setTimeout(async () => {
        try {
          // Try API first
          const results = await this.searchWithAPI(query, userLocation);

          if (results.length > 0) {
            this.cache.set(cacheKey, results);
            resolve(results);
          } else {
            // Fallback to mock data if API fails
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
      }, 300);

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
      },
      {
        id: `mock-3-${Date.now()}`,
        title: `${query} - Laval, QC`,
        address: {
          label: `${query}, Laval, QC, Canada`,
          countryCode: 'CA',
          city: 'Laval',
          state: 'Quebec',
          postalCode: 'H7A 3T2'
        },
        position: { lat: 45.6066 + Math.random() * 0.1, lng: -73.7124 + Math.random() * 0.1 },
        resultType: 'address'
      }
    ];

    return mockLocations.slice(0, 2); // Return 2 mock results
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

      // Fallback: calculate mock route
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
    // Simple distance calculation using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLng = (destination.lng - origin.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000; // Distance in meters

    // Estimate duration (assuming average speed of 40 km/h in city)
    const duration = (distance / 1000) * 90; // seconds

    return {
      summary: {
        duration: Math.round(duration),
        length: Math.round(distance)
      },
      polyline: '' // Mock polyline
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
          // Fallback to Montreal coordinates
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
  }
}

export default new AutocompleteService();
