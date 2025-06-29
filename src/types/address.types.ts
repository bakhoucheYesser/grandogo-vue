// src/types/address.types.ts
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

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}
