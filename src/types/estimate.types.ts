// src/types/estimate.types.ts - Types mis à jour pour Lugg
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  displayName: string;
  description: string;
  basePrice: number;
  perMinute: number;
  perKm: number;
  maxWeight: number;
  dimensions: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CreateEstimateRequest {
  pickup: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  vehicleType: string;
  estimatedDuration?: number;
}

export interface EstimateResult {
  id: string;
  pickup: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  vehicle: Vehicle;
  route: {
    summary: {
      duration: number;
      length: number;
    };
    polyline?: string;
  };
  pricing: {
    basePrice: number;
    laborCost: number;
    mileageCost: number;
    bookingFee: number;
    totalPrice: number;
    breakdown: {
      basePrice: string;
      laborCost: string;
      mileageCost: string;
      bookingFee: string;
    };
  };
  estimatedDuration: number;
}

// Types pour l'autocomplete
export interface PlaceResult {
  id: string;
  title: string;
  address: {
    label: string;
    countryCode: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  position: {
    lat: number;
    lng: number;
  };
  resultType: string;
  distance?: number;
}

export interface RouteResult {
  summary: {
    duration: number; // en secondes
    length: number;   // en mètres
  };
  polyline: string;
}

// Types pour les véhicules par défaut
export interface VehicleOption {
  id: string;
  name: string;
  displayName: string;
  description: string;
  basePrice: number;
  perMinute: number;
  perKm: number;
  maxWeight: number;
  dimensions: string;
  features: string[];
  image: string;
}

// Type pour l'estimation en cours
export interface EstimateState {
  pickupLocation: Location | null;
  destinationLocation: Location | null;
  selectedVehicle: Vehicle | null;
  estimatedDuration: number;
  currentEstimate: EstimateResult | null;
  availableVehicles: Vehicle[];
  isCalculating: boolean;
  error: string | null;
}

// Types pour les prix
export interface PricingBreakdown {
  basePrice: number;
  laborCost: number;
  mileageCost: number;
  bookingFee: number;
  totalPrice: number;
  breakdown: {
    [key: string]: string;
  };
}

// Types pour l'API de géocodage
export interface GeocodingSearchParams {
  query: string;
  userLocation?: { lat: number; lng: number };
  limit?: number;
}

export interface GeocodingSearchResponse {
  items: PlaceResult[];
}

export interface RouteCalculationParams {
  origin: string; // "lat,lng"
  destination: string; // "lat,lng"
}

export interface RouteCalculationResponse {
  routes: Array<{
    sections: Array<{
      summary: {
        duration: number;
        length: number;
      };
      polyline: string;
    }>;
  }>;
}

// Enum pour les statuts d'estimation
export enum EstimateStatus {
  INCOMPLETE = 'incomplete',
  READY = 'ready',
  CALCULATING = 'calculating',
  COMPLETE = 'complete',
  ERROR = 'error'
}

// Type pour les erreurs d'API
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Types pour l'interface utilisateur
export interface AddressInputProps {
  modelValue: string;
  placeholder?: string;
  type: 'pickup' | 'destination';
  userLocation?: { lat: number; lng: number } | null;
  disabled?: boolean;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  routeInfo?: RouteResult | null;
  selected?: boolean;
  loading?: boolean;
}

// Export par défaut des véhicules
export const DEFAULT_VEHICLES: VehicleOption[] = [
  {
    id: 'pickup',
    name: 'Pickup',
    displayName: 'Pickup Truck',
    description: 'Perfect for smaller items',
    basePrice: 45.60,
    perMinute: 1.94,
    perKm: 2.00,
    maxWeight: 500,
    dimensions: '6ft bed',
    features: ['Up to 500 lbs', '6ft truck bed', 'Single item moves'],
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIyMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMzc0MTUxIi8+CjxyZWN0IHg9IjIwIiB5PSIxMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzc0MTUxIi8+CjxjaXJjbGUgY3g9IjI1IiBjeT0iNTAiIHI9IjgiIGZpbGw9IiMxRjI5MzciLz4KPGNpcmNsZSBjeD0iNzUiIGN5PSI1MCIgcj0iOCIgZmlsbD0iIzFGMjkzNyIvPgo8dGV4dCB4PSI1MCIgeT0iMzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEwIj5QaWNrdXA8L3RleHQ+Cjwvc3ZnPgo='
  },
  {
    id: 'van',
    name: 'Van',
    displayName: 'Cargo Van',
    description: 'Good for medium loads',
    basePrice: 106.49,
    perMinute: 2.42,
    perKm: 2.25,
    maxWeight: 1000,
    dimensions: '8ft cargo',
    features: ['Up to 1,000 lbs', 'Enclosed cargo', 'Weather protection'],
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxNSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjI1IiBmaWxsPSIjMzc0MTUxIi8+CjxyZWN0IHg9IjIwIiB5PSIxMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjUiIGZpbGw9IiMzNzQxNTEiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSI1MCIgcj0iOCIgZmlsbD0iIzFGMjkzNyIvPgo8Y2lyY2xlIGN4PSI3NSIgY3k9IjUwIiByPSI4IiBmaWxsPSIjMUYyOTM3Ii8+Cjx0ZXh0IHg9IjUwIiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPlZhbjwvdGV4dD4KPC9zdmc+Cg=='
  },
  {
    id: 'xl',
    name: 'XL',
    displayName: 'XL Truck',
    description: 'Ideal for larger items',
    basePrice: 187.52,
    perMinute: 2.76,
    perKm: 2.50,
    maxWeight: 2000,
    dimensions: '10ft bed',
    features: ['Up to 2,000 lbs', '10ft truck bed', 'Large furniture'],
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUiIHk9IjIwIiB3aWR0aD0iOTAiIGhlaWdodD0iMjAiIGZpbGw9IiMzNzQxNTEiLz4KPHJlY3QgeD0iMjAiIHk9IjEwIiB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIGZpbGw9IiMzNzQxNTEiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSI1MCIgcj0iOCIgZmlsbD0iIzFGMjkzNyIvPgo8Y2lyY2xlIGN4PSI0NSIgY3k9IjUwIiByPSI4IiBmaWxsPSIjMUYyOTM3Ii8+CjxjaXJjbGUgY3g9IjgwIiBjeT0iNTAiIHI9IjgiIGZpbGw9IiMxRjI5MzciLz4KPHRleHQgeD0iNTAiIHk9IjM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCI+WEw8L3RleHQ+Cjwvc3ZnPgo='
  },
  {
    id: 'box',
    name: 'Box',
    displayName: 'Box Truck',
    description: 'For full moves',
    basePrice: 203.92,
    perMinute: 3.00,
    perKm: 3.00,
    maxWeight: 4000,
    dimensions: '12ft box',
    features: ['Up to 4,000 lbs', '12ft cargo space', 'Maximum capacity'],
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUiIHk9IjEwIiB3aWR0aD0iOTAiIGhlaWdodD0iMzAiIGZpbGw9IiMzNzQxNTEiLz4KPHJlY3QgeD0iMjAiIHk9IjUiIHdpZHRoPSIzMCIgaGVpZ2h0PSI1IiBmaWxsPSIjMzc0MTUxIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iNTAiIHI9IjgiIGZpbGw9IiMxRjI5MzciLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI1MCIgcj0iOCIgZmlsbD0iIzFGMjkzNyIvPgo8Y2lyY2xlIGN4PSI2MCIgY3k9IjUwIiByPSI4IiBmaWxsPSIjMUYyOTM3Ii8+CjxjaXJjbGUgY3g9IjgwIiBjeT0iNTAiIHI9IjgiIGZpbGw9IiMxRjI5MzciLz4KPHRleHQgeD0iNTAiIHk9IjI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCI+Qm94PC90ZXh0Pgo8L3N2Zz4K'
  }
];

// Utilitaires de formatage
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
};
