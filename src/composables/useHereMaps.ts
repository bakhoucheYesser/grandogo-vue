// src/composables/useHeroMap.ts
import { ref, watch, nextTick } from 'vue';
import type { Location } from '@/types/address.types';

export function useHeroMap() {
  const mapContainer = ref<HTMLElement | null>(null);
  const map = ref<any>(null);
  const platform = ref<any>(null);
  const mapInitialized = ref(false);
  const mapError = ref<string | null>(null);

  // Markers storage
  const pickupMarker = ref<any>(null);
  const destinationMarker = ref<any>(null);
  const routeLine = ref<any>(null);

  // Check HERE SDK availability
  const checkHereSDK = (): boolean => {
    return typeof window !== 'undefined' &&
      typeof (window as any).H !== 'undefined';
  };

  // Wait for HERE SDK to load
  const waitForHereSDK = (timeout = 10000): Promise<boolean> => {
    return new Promise((resolve) => {
      if (checkHereSDK()) {
        resolve(true);
        return;
      }

      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (checkHereSDK()) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 100);
    });
  };

  // Initialize the map
  const initializeMap = async (apiKey: string, userLocation?: { lat: number; lng: number }) => {
    try {
      console.log('🗺️ Initializing hero map...');

      if (!apiKey) {
        throw new Error('HERE Maps API key is required');
      }

      await nextTick();

      if (!mapContainer.value) {
        throw new Error('Map container not found');
      }

      // Wait for HERE SDK
      const sdkLoaded = await waitForHereSDK();
      if (!sdkLoaded) {
        throw new Error('HERE Maps SDK failed to load');
      }

      // Initialize platform
      platform.value = new (window as any).H.service.Platform({
        'apikey': apiKey
      });

      const defaultLayers = platform.value.createDefaultLayers();

      // Set initial center
      const center = userLocation || { lat: 45.5017, lng: -73.5673 };

      // Create map
      map.value = new (window as any).H.Map(
        mapContainer.value,
        defaultLayers.vector.normal.map,
        {
          zoom: userLocation ? 12 : 10,
          center: center
        }
      );

      // Enable interactions
      new (window as any).H.mapevents.Behavior();

      // Add basic UI controls (zoom buttons)
      const ui = new (window as any).H.ui.UI.createDefault(map.value);

      // Style the map for hero background
      applyHeroMapStyling();

      mapInitialized.value = true;
      mapError.value = null;

      console.log('✅ Hero map initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing hero map:', error);
      mapError.value = error instanceof Error ? error.message : 'Failed to initialize map';
      mapInitialized.value = false;
    }
  };

  // Apply specific styling for hero background
  const applyHeroMapStyling = () => {
    if (!mapContainer.value || !map.value) return;

    try {
      // Apply subtle styling for background use
      const style = {
        filter: 'grayscale(40%) contrast(0.8) brightness(1.1) saturate(0.6)',
        opacity: '0.8'
      };

      const mapElement = mapContainer.value.querySelector('.H_Map') as HTMLElement;
      if (mapElement) {
        Object.assign(mapElement.style, style);
      }

      // Hide default UI for cleaner look
      const uiElements = mapContainer.value.querySelectorAll('.H_ui');
      uiElements.forEach(element => {
        (element as HTMLElement).style.opacity = '0.7';
      });

    } catch (error) {
      console.warn('⚠️ Failed to apply hero map styling:', error);
    }
  };

  // Add pickup marker
  const addPickupMarker = (location: Location) => {
    if (!map.value || !mapInitialized.value) return;

    try {
      // Remove existing pickup marker
      if (pickupMarker.value) {
        map.value.removeObject(pickupMarker.value);
      }

      // Create pickup marker
      const pickupIcon = createMarkerIcon('pickup');
      pickupMarker.value = new (window as any).H.map.Marker(location, { icon: pickupIcon });
      map.value.addObject(pickupMarker.value);

      console.log('📍 Pickup marker added');
    } catch (error) {
      console.error('❌ Error adding pickup marker:', error);
    }
  };

  // Add destination marker
  const addDestinationMarker = (location: Location) => {
    if (!map.value || !mapInitialized.value) return;

    try {
      // Remove existing destination marker
      if (destinationMarker.value) {
        map.value.removeObject(destinationMarker.value);
      }

      // Create destination marker
      const destinationIcon = createMarkerIcon('destination');
      destinationMarker.value = new (window as any).H.map.Marker(location, { icon: destinationIcon });
      map.value.addObject(destinationMarker.value);

      console.log('🎯 Destination marker added');
    } catch (error) {
      console.error('❌ Error adding destination marker:', error);
    }
  };

  // Create marker icon
  const createMarkerIcon = (type: 'pickup' | 'destination') => {
    const isPickup = type === 'pickup';
    const color = isPickup ? '#dc2626' : '#7f1d1d';
    const symbol = isPickup ? 'P' : 'D';

    const svgMarkup = `
      <svg width="36" height="44" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${type}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.4)"/>
          </filter>
        </defs>
        <path d="M18 0C8.059 0 0 8.059 0 18c0 18 18 26 18 26s18-8 18-26C36 8.059 27.941 0 18 0z"
              fill="${color}" filter="url(#shadow-${type})"/>
        <circle cx="18" cy="18" r="12" fill="white"/>
        <text x="18" y="23" text-anchor="middle" fill="${color}"
              font-size="14" font-weight="bold" font-family="Arial, sans-serif">
          ${symbol}
        </text>
      </svg>
    `;

    return new (window as any).H.map.Icon(
      `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`,
      { size: { w: 36, h: 44 }, anchor: { x: 18, y: 44 } }
    );
  };

  // Draw route between pickup and destination
  const drawRoute = (pickup: Location, destination: Location) => {
    if (!map.value || !mapInitialized.value) return;

    try {
      // Remove existing route
      if (routeLine.value) {
        map.value.removeObject(routeLine.value);
      }

      // Create route line
      const lineString = new (window as any).H.geo.LineString();
      lineString.pushPoint(pickup);
      lineString.pushPoint(destination);

      routeLine.value = new (window as any).H.map.Polyline(lineString, {
        style: {
          lineWidth: 5,
          strokeColor: '#ef4444',
          lineDash: [8, 4],
          opacity: 0.9,
          lineCap: 'round'
        }
      });

      map.value.addObject(routeLine.value);

      // Fit view to show both markers with padding
      fitToMarkers([pickup, destination]);

      console.log('🛣️ Route drawn successfully');
    } catch (error) {
      console.error('❌ Error drawing route:', error);
    }
  };

  // Fit map view to show markers
  const fitToMarkers = (locations: Location[], padding = 80) => {
    if (!map.value || locations.length === 0) return;

    try {
      const group = new (window as any).H.map.Group();
      locations.forEach(location => {
        group.addObject(new (window as any).H.map.Marker(location));
      });

      map.value.getViewModel().setLookAtData({
        bounds: group.getBoundingBox(),
        padding: { top: padding, right: padding, bottom: padding, left: padding }
      });
    } catch (error) {
      console.error('❌ Error fitting to markers:', error);
    }
  };

  // Center map on user location
  const centerOnLocation = (location: Location, zoom = 14) => {
    if (!map.value || !mapInitialized.value) return;

    try {
      map.value.setCenter(location);
      map.value.setZoom(zoom);
      console.log('📍 Map centered on location');
    } catch (error) {
      console.error('❌ Error centering map:', error);
    }
  };

  // Clear all map objects
  const clearMap = () => {
    if (!map.value) return;

    try {
      // Remove all objects
      map.value.removeObjects(map.value.getObjects());

      // Reset references
      pickupMarker.value = null;
      destinationMarker.value = null;
      routeLine.value = null;

      console.log('🧹 Map cleared');
    } catch (error) {
      console.error('❌ Error clearing map:', error);
    }
  };

  // Dispose map resources
  const dispose = () => {
    if (map.value) {
      map.value.dispose?.();
      map.value = null;
    }
    platform.value = null;
    mapInitialized.value = false;
  };

  return {
    mapContainer,
    map,
    mapInitialized,
    mapError,
    initializeMap,
    addPickupMarker,
    addDestinationMarker,
    drawRoute,
    centerOnLocation,
    clearMap,
    dispose,
    checkHereSDK
  };
}
