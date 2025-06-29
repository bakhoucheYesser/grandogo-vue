// src/composables/useHereMaps.ts
import { ref } from 'vue';
import type { Location } from '@/types/address.types';

export function useHereMaps() {
  const mapContainer = ref<HTMLElement | null>(null);
  const map = ref<any>(null);
  const platform = ref<any>(null);

  const pickup = ref<Location | null>(null);
  const destination = ref<Location | null>(null);

  const initializeMap = async (apiKey: string) => {
    if (!mapContainer.value) return;

    try {
      // Vérifier si HERE Maps est disponible
      if (typeof window.H === 'undefined') {
        console.error('HERE Maps SDK not loaded');
        return;
      }

      // Initialize HERE platform
      platform.value = new window.H.service.Platform({
        'apikey': apiKey
      });

      const defaultLayers = platform.value.createDefaultLayers();

      // Initialize map
      map.value = new window.H.Map(
        mapContainer.value,
        defaultLayers.vector.normal.map,
        {
          zoom: 10,
          center: { lat: 45.5017, lng: -73.5673 } // Montreal par défaut
        }
      );

      // Enable map interaction
      new window.H.mapevents.Behavior();
      new window.H.ui.UI.createDefault(map.value);

      // Apply grayscale style
      applyGrayscaleStyle();

      console.log('HERE Maps initialized successfully');
    } catch (error) {
      console.error('Error initializing HERE Maps:', error);
    }
  };

  const applyGrayscaleStyle = () => {
    if (!map.value || !mapContainer.value) return;

    // Apply CSS filter for grayscale
    const mapElement = mapContainer.value.querySelector('.H_Map');
    if (mapElement) {
      (mapElement as HTMLElement).style.filter = 'grayscale(100%) contrast(1.2) brightness(0.95)';
    }
  };

  const addMarker = (location: Location, type: 'pickup' | 'destination') => {
    if (!map.value) return;

    const color = type === 'pickup' ? '#dc2626' : '#7f1d1d'; // red-600 et red-900

    // Create custom marker
    const svgMarkup = `
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
          ${type === 'pickup' ? '↑' : '↓'}
        </text>
      </svg>
    `;

    const icon = new window.H.map.Icon(
      `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`,
      { size: { w: 32, h: 32 } }
    );

    const marker = new window.H.map.Marker(location, { icon });
    map.value.addObject(marker);

    if (type === 'pickup') {
      pickup.value = location;
    } else {
      destination.value = location;
    }
  };

  const drawRoute = async (pickupCoords: string, destinationCoords: string) => {
    if (!map.value || !platform.value) return;

    try {
      // Simuler le tracé de route pour l'instant
      console.log('Drawing route from', pickupCoords, 'to', destinationCoords);

      // TODO: Implémenter le vrai tracé de route HERE
      // Pour l'instant, on trace juste une ligne droite
      const [pickupLat, pickupLng] = pickupCoords.split(',').map(Number);
      const [destLat, destLng] = destinationCoords.split(',').map(Number);

      const lineString = new window.H.geo.LineString();
      lineString.pushPoint({ lat: pickupLat, lng: pickupLng });
      lineString.pushPoint({ lat: destLat, lng: destLng });

      const routeLine = new window.H.map.Polyline(lineString, {
        style: {
          lineWidth: 4,
          strokeColor: '#f87171' // red-400
        }
      });

      map.value.addObject(routeLine);

    } catch (error) {
      console.error('Error drawing route:', error);
    }
  };

  const clearMap = () => {
    if (!map.value) return;
    map.value.removeObjects(map.value.getObjects());
  };

  const fitToCoordinates = (coordinates: Location[]) => {
    if (!map.value || coordinates.length === 0) return;

    try {
      const group = new window.H.map.Group();
      coordinates.forEach(coord => {
        group.addObject(new window.H.map.Marker(coord));
      });

      map.value.getViewModel().setLookAtData({
        bounds: group.getBoundingBox(),
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });
    } catch (error) {
      console.error('Error fitting to coordinates:', error);
    }
  };

  return {
    mapContainer,
    map,
    pickup,
    destination,
    initializeMap,
    addMarker,
    drawRoute,
    clearMap,
    fitToCoordinates
  };
}
