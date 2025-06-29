// src/services/autocomplete.service.ts
import apiClient from '@/services/api';
import type { PlaceResult, RouteResult } from '@/types/address.types';

class AutocompleteService {
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  async searchPlaces(
    query: string,
    userLocation?: { lat: number; lng: number },
    debounceKey = 'default'
  ): Promise<PlaceResult[]> {
    return new Promise((resolve) => {
      // Clear existing debounce timer
      const existingTimer = this.debounceTimers.get(debounceKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new debounce timer
      const timer = setTimeout(async () => {
        try {
          const params = new URLSearchParams({
            q: query,
            ...(userLocation && {
              lat: userLocation.lat.toString(),
              lng: userLocation.lng.toString()
            })
          });

          const response = await apiClient.get(`/geocoding/search?${params}`);

          if (response.data.items) {
            const places: PlaceResult[] = response.data.items.map((item: any) => ({
              id: item.id,
              title: item.title,
              address: item.address,
              position: item.position,
              resultType: item.resultType,
              distance: item.distance
            }));

            resolve(places);
          } else {
            resolve([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          resolve([]);
        } finally {
          this.debounceTimers.delete(debounceKey);
        }
      }, 300);

      this.debounceTimers.set(debounceKey, timer);
    });
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

      return null;
    } catch (error) {
      console.error('Route calculation error:', error);
      return null;
    }
  }

  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
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
          resolve(null);
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
}

export default new AutocompleteService();
