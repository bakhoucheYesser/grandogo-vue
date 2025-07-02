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
