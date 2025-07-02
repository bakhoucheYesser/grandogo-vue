import apiClient from '@/services/api';
import type { CreateEstimateRequest, EstimateResult, Vehicle } from '@/types/estimate.types';

class EstimateService {
  async calculateEstimate(data: CreateEstimateRequest): Promise<EstimateResult> {
    const response = await apiClient.post('/estimate/calculate', data);
    return response.data;
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    const response = await apiClient.get('/estimate/vehicles');
    return response.data;
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
}

export default new EstimateService();
