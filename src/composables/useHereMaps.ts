// src/composables/useHereMaps.ts (Fixed version with better error handling)
import { ref, nextTick } from 'vue';
import type { Location } from '@/types/address.types';

export function useHereMaps() {
  const mapContainer = ref<HTMLElement | null>(null);
  const map = ref<any>(null);
  const platform = ref<any>(null);
  const mapInitialized = ref(false);
  const mapError = ref<string | null>(null);

  const pickup = ref<Location | null>(null);
  const destination = ref<Location | null>(null);

  // Check if HERE Maps scripts are loaded
  const checkHereSDK = (): boolean => {
    return typeof window !== 'undefined' &&
      typeof (window as any).H !== 'undefined' &&
      typeof (window as any).H.service !== 'undefined' &&
      typeof (window as any).H.Map !== 'undefined';
  };

  // Wait for HERE Maps SDK to load
  const waitForHereSDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (checkHereSDK()) {
        console.log('✅ HERE Maps SDK already loaded');
        resolve(true);
        return;
      }

      console.log('⏳ Waiting for HERE Maps SDK to load...');
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds total

      const checkInterval = setInterval(() => {
        attempts++;

        if (checkHereSDK()) {
          console.log('✅ HERE Maps SDK loaded successfully');
          clearInterval(checkInterval);
          resolve(true);
        } else if (attempts >= maxAttempts) {
          console.error('❌ HERE Maps SDK failed to load after 5 seconds');
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 100);
    });
  };

  const initializeMap = async (apiKey: string) => {
    try {
      console.log('🗺️ Starting map initialization...');

      if (!apiKey) {
        throw new Error('HERE Maps API key is required. Please check your .env file.');
      }

      console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');

      // Wait for DOM element to be available
      await nextTick();

      if (!mapContainer.value) {
        throw new Error('Map container element not found. Check if ref="mapContainer" is properly set.');
      }

      console.log('📦 Map container found');

      // Wait for HERE SDK to load
      const sdkLoaded = await waitForHereSDK();
      if (!sdkLoaded) {
        throw new Error('HERE Maps SDK failed to load. Please check your internet connection and the script tags in index.html.');
      }

      // Initialize HERE platform
      console.log('🚀 Initializing HERE platform...');
      platform.value = new (window as any).H.service.Platform({
        'apikey': apiKey
      });

      console.log('✅ HERE platform initialized');

      // Get default layers
      const defaultLayers = platform.value.createDefaultLayers();
      console.log('🗂️ Default layers created');

      // Initialize map
      console.log('🗺️ Creating map instance...');
      map.value = new (window as any).H.Map(
        mapContainer.value,
        defaultLayers.vector.normal.map,
        {
          zoom: 10,
          center: { lat: 45.5017, lng: -73.5673 } // Montreal default
        }
      );

      console.log('✅ Map instance created');

      // Enable map interaction
      new (window as any).H.mapevents.Behavior();
      new (window as any).H.ui.UI.createDefault(map.value);

      console.log('✅ Map interactions enabled');

      // Apply grayscale styling after a delay
      setTimeout(() => {
        applyGrayscaleStyle();
      }, 1000);

      mapInitialized.value = true;
      mapError.value = null;

      console.log('🎉 HERE Maps initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing HERE Maps:', error);
      mapError.value = error instanceof Error ? error.message : 'Failed to initialize map';
      mapInitialized.value = false;

      // Show fallback map
      initializeFallbackMap();
    }
  };

  const applyGrayscaleStyle = () => {
    if (!map.value || !mapContainer.value) return;

    try {
      console.log('🎨 Applying grayscale styling...');

      // Apply multiple times to catch all elements
      const applyFilters = () => {
        const selectors = [
          '.H_Map',
          '.H_Map canvas',
          '.H_Map img',
          '.H_Map svg',
          '.H_Map > div'
        ];

        const grayscaleFilter = 'grayscale(100%) contrast(1.3) brightness(0.9) saturate(0%)';

        selectors.forEach(selector => {
          const elements = mapContainer.value?.querySelectorAll(selector);
          elements?.forEach((element) => {
            const htmlElement = element as HTMLElement;
            htmlElement.style.filter = grayscaleFilter;
            htmlElement.style.webkitFilter = grayscaleFilter;
          });
        });

        // Apply to container
        if (mapContainer.value) {
          mapContainer.value.style.filter = grayscaleFilter;
          mapContainer.value.style.background = '#f8f9fa';
        }
      };

      // Apply immediately and with delays
      applyFilters();
      setTimeout(applyFilters, 500);
      setTimeout(applyFilters, 1500);
      setTimeout(applyFilters, 3000);

      console.log('✅ Grayscale styling applied');
    } catch (error) {
      console.warn('⚠️ Failed to apply grayscale styling:', error);
    }
  };

  const addMarker = (location: Location, type: 'pickup' | 'destination') => {
    if (!map.value) {
      console.warn('Map not initialized, cannot add marker');
      return;
    }

    try {
      const color = type === 'pickup' ? '#dc2626' : '#7f1d1d';
      const symbol = type === 'pickup' ? 'P' : 'D';

      // Create custom marker SVG
      const svgMarkup = `
        <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow-${type}" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
            </filter>
          </defs>
          <path d="M16 0C7.164 0 0 7.164 0 16c0 16 16 24 16 24s16-8 16-24C32 7.164 24.836 0 16 0z"
                fill="${color}" filter="url(#shadow-${type})"/>
          <circle cx="16" cy="16" r="10" fill="white"/>
          <text x="16" y="20" text-anchor="middle" fill="${color}"
                font-size="12" font-weight="bold" font-family="Arial, sans-serif">
            ${symbol}
          </text>
        </svg>
      `;

      const icon = new (window as any).H.map.Icon(
        `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`,
        { size: { w: 32, h: 40 }, anchor: { x: 16, y: 40 } }
      );

      const marker = new (window as any).H.map.Marker(location, { icon });
      map.value.addObject(marker);

      // Store the location
      if (type === 'pickup') {
        pickup.value = location;
      } else {
        destination.value = location;
      }

      console.log(`✅ ${type} marker added at:`, location);
    } catch (error) {
      console.error('❌ Error adding marker:', error);
    }
  };

  const drawRoute = async (pickupCoords: string, destinationCoords: string) => {
    if (!map.value || !platform.value) {
      console.warn('Map or platform not initialized, cannot draw route');
      return;
    }

    try {
      console.log('🛣️ Drawing route from', pickupCoords, 'to', destinationCoords);

      const [pickupLat, pickupLng] = pickupCoords.split(',').map(Number);
      const [destLat, destLng] = destinationCoords.split(',').map(Number);

      const lineString = new (window as any).H.geo.LineString();
      lineString.pushPoint({ lat: pickupLat, lng: pickupLng });
      lineString.pushPoint({ lat: destLat, lng: destLng });

      const routeLine = new (window as any).H.map.Polyline(lineString, {
        style: {
          lineWidth: 4,
          strokeColor: '#f87171', // red-400
          lineDash: [4, 4],
          opacity: 0.8
        }
      });

      map.value.addObject(routeLine);

      // Fit map to show both points
      fitToCoordinates([
        { lat: pickupLat, lng: pickupLng },
        { lat: destLat, lng: destLng }
      ]);

      console.log('✅ Route drawn successfully');
    } catch (error) {
      console.error('❌ Error drawing route:', error);
    }
  };

  const clearMap = () => {
    if (!map.value) return;

    try {
      map.value.removeObjects(map.value.getObjects());
      console.log('🧹 Map cleared');
    } catch (error) {
      console.error('❌ Error clearing map:', error);
    }
  };

  const fitToCoordinates = (coordinates: Location[]) => {
    if (!map.value || coordinates.length === 0) return;

    try {
      const group = new (window as any).H.map.Group();
      coordinates.forEach(coord => {
        group.addObject(new (window as any).H.map.Marker(coord));
      });

      map.value.getViewModel().setLookAtData({
        bounds: group.getBoundingBox(),
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });
    } catch (error) {
      console.error('❌ Error fitting to coordinates:', error);
    }
  };

  // Fallback map initialization without HERE Maps
  const initializeFallbackMap = () => {
    if (!mapContainer.value) return;

    console.log('🔄 Initializing fallback map...');

    mapContainer.value.innerHTML = `
      <div class="w-full h-full bg-gray-200 flex items-center justify-center" style="filter: grayscale(100%);">
        <div class="text-center p-8">
          <div class="text-4xl mb-4">🗺️</div>
          <div class="text-lg font-semibold text-gray-700 mb-2">Map in Fallback Mode</div>
          <div class="text-sm text-gray-500 mb-4">HERE Maps is temporarily unavailable</div>
          <div class="text-xs text-gray-400">Your address search will still work!</div>
        </div>
      </div>
    `;

    mapInitialized.value = true;
    mapError.value = null;
  };

  return {
    mapContainer,
    map,
    mapInitialized,
    mapError,
    pickup,
    destination,
    initializeMap,
    initializeFallbackMap,
    addMarker,
    drawRoute,
    clearMap,
    fitToCoordinates,
    checkHereSDK
  };
}
