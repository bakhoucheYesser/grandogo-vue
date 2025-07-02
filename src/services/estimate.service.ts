// src/services/estimate.service.ts
import apiClient from '@/services/api';
import type { CreateEstimateRequest, EstimateResult, Vehicle } from '@/types/estimate.types';

class EstimateService {
  async calculateEstimate(data: CreateEstimateRequest): Promise<EstimateResult> {
    const response = await apiClient.post('/estimate/calculate', data);
    return response.data;
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    try {
      const response = await apiClient.get('/estimate/vehicles');
      return response.data;
    } catch (error) {
      console.warn('Failed to load vehicles from API, using mock data');
      return this.getMockVehicles();
    }
  }

  async saveEstimate(estimateId: string): Promise<EstimateResult> {
    const response = await apiClient.post(`/estimate/${estimateId}/save`);
    return response.data;
  }

  async searchAddresses(query: string, userLocation?: { lat: number; lng: number }) {
    const response = await apiClient.post('/estimate/geocode/search', {
      query,
      userLocation,
    });
    return response.data;
  }

  async calculateRoute(origin: string, destination: string) {
    const response = await apiClient.post('/estimate/geocode/route', {
      origin,
      destination,
    });
    return response.data;
  }

  // Mock vehicles fallback
  private getMockVehicles(): Vehicle[] {
    return [
      {
        id: 'pickup',
        name: 'Pickup',
        displayName: 'Pickup Truck',
        description: 'Perfect for smaller items',
        basePrice: 40,
        perMinute: 1.50,
        perKm: 2.00,
        maxWeight: 500,
        dimensions: '6ft bed',
        imageUrl: '/images/vehicles/pickup.svg'
      },
      {
        id: 'van',
        name: 'Van',
        displayName: 'Cargo Van',
        description: 'Good for medium loads',
        basePrice: 50,
        perMinute: 1.75,
        perKm: 2.25,
        maxWeight: 1000,
        dimensions: '8ft cargo',
        imageUrl: '/images/vehicles/van.svg'
      },
      {
        id: 'xl',
        name: 'XL Truck',
        displayName: 'XL Truck',
        description: 'Ideal for larger items',
        basePrice: 65,
        perMinute: 2.00,
        perKm: 2.50,
        maxWeight: 2000,
        dimensions: '10ft bed',
        imageUrl: '/images/vehicles/xl.svg'
      },
      {
        id: 'box',
        name: 'Box Truck',
        displayName: 'Box Truck',
        description: 'For full moves',
        basePrice: 85,
        perMinute: 2.50,
        perKm: 3.00,
        maxWeight: 4000,
        dimensions: '12ft box',
        imageUrl: '/images/vehicles/box.svg'
      }
    ];
  }
}

export default new EstimateService();
