// backend/src/services/here-geocoding.service.ts
import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

interface HereSearchParams {
q: string;
limit?: number;
at?: string;
}

interface HerePlace {
id?: string;
title: string;
address?: {
label?: string;
countryCode?: string;
city?: string;
state?: string;
county?: string;
postalCode?: string;
};
position?: {
lat: number;
lng: number;
};
resultType?: string;
distance?: number;
}

interface RouteResult {
summary: {
duration: number;
length: number;
};
polyline?: string;
sections?: any[];
}

export class HereGeocoding {
private client: AxiosInstance;
private apiKey: string;

constructor() {
this.apiKey = config.hereApiKey || '';

if (!this.apiKey) {
logger.warn('⚠️ HERE Maps API key not configured, using mock data');
}

this.client = axios.create({
timeout: 10000,
headers: {
'Content-Type': 'application/json',
},
});

// Add request interceptor for logging
this.client.interceptors.request.use(
(config) => {
logger.debug(`🌐 HERE API Request: ${config.method?.toUpperCase()} ${config.url}`);
return config;
},
(error) => {
logger.error('❌ HERE API Request Error:', error);
return Promise.reject(error);
}
);

// Add response interceptor for logging
this.client.interceptors.response.use(
(response) => {
logger.debug(`✅ HERE API Response: ${response.status} ${response.config.url}`);
return response;
},
(error) => {
logger.error(`❌ HERE API Error: ${error.response?.status} ${error.config?.url}`, {
status: error.response?.status,
data: error.response?.data,
message: error.message
});
return Promise.reject(error);
}
);
}

/**
* Search for places using HERE Geocoding API
*/
async searchPlaces(params: HereSearchParams): Promise<HerePlace[]> {
if (!this.apiKey) {
throw new Error('HERE Maps API key not configured');
}

try {
const searchParams = new URLSearchParams({
apikey: this.apiKey,
q: params.q,
limit: (params.limit || 5).toString(),
...(params.at && { at: params.at })
});

const response = await this.client.get(
`https://geocode.search.hereapi.com/v1/geocode?${searchParams}`
);

if (response.data && response.data.items) {
return response.data.items.map((item: any) => ({
id: item.id,
title: item.title,
address: {
label: item.address?.label,
countryCode: item.address?.countryCode,
city: item.address?.city,
state: item.address?.state || item.address?.county,
postalCode: item.address?.postalCode
},
position: {
lat: item.position?.lat,
lng: item.position?.lng
},
resultType: item.resultType,
distance: item.distance
}));
}

return [];
} catch (error) {
logger.error('❌ HERE Geocoding search failed:', error);
throw error;
}
}

/**
* Calculate route between two points
*/
async calculateRoute(origin: string, destination: string): Promise<RouteResult | null> {
if (!this.apiKey) {
throw new Error('HERE Maps API key not configured');
}

try {
const routeParams = new URLSearchParams({
apikey: this.apiKey,
transportMode: 'car',
origin,
destination,
'return': 'summary,polyline'
});

const response = await this.client.get(
`https://router.hereapi.com/v8/routes?${routeParams}`
);

if (response.data && response.data.routes && response.data.routes.length > 0) {
const route = response.data.routes[0];

return {
summary: {
duration: route.sections[0]?.summary?.duration || 0,
length: route.sections[0]?.summary?.length || 0
},
polyline: route.sections[0]?.polyline || '',
sections: route.sections || []
};
}

return null;
} catch (error) {
logger.error('❌ HERE Routing failed:', error);
throw error;
}
}

/**
* Reverse geocoding - get address from coordinates
*/
async reverseGeocode(lat: number, lng: number): Promise<HerePlace | null> {
  if (!this.apiKey) {
  throw new Error('HERE Maps API key not configured');
  }

  try {
  const reverseParams = new URLSearchParams({
  apikey: this.apiKey,
  at: `${lat},${lng}`,
  limit: '1'
  });

  const response = await this.client.get(
  `https://revgeocode.search.hereapi.com/v1/revgeocode?${reverseParams}`
  );

  if (response.data && response.data.items && response.data.items.length > 0) {
  const item = response.data.items[0];

  return {
  id: item.id,
  title: item.title,
  address: {
  label: item.address?.label,
  countryCode: item.address?.countryCode,
  city: item.address?.city,
  state: item.address?.state || item.address?.county,
  postalCode: item.address?.postalCode
  },
  position: {
  lat: item.position?.lat || lat,
  lng: item.position?.lng || lng
  },
  resultType: item.resultType
  };
  }

  return null;
  } catch (error) {
  logger.error('❌ HERE Reverse geocoding failed:', error);
  throw error;
  }
  }

  /**
  * Get distance matrix between multiple points
  */
  async getDistanceMatrix(origins: string[], destinations: string[]): Promise<any> {
    if (!this.apiKey) {
    throw new Error('HERE Maps API key not configured');
    }

    try {
    const matrixParams = new URLSearchParams({
    apikey: this.apiKey,
    async: 'false',
    regionDefinition: 'world'
    });

    // Add origins
    origins.forEach((origin, index) => {
    matrixParams.append(`origins[${index}][lat]`, origin.split(',')[0]);
    matrixParams.append(`origins[${index}][lng]`, origin.split(',')[1]);
    });

    // Add destinations
    destinations.forEach((destination, index) => {
    matrixParams.append(`destinations[${index}][lat]`, destination.split(',')[0]);
    matrixParams.append(`destinations[${index}][lng]`, destination.split(',')[1]);
    });

    const response = await this.client.get(
    `https://matrix.router.hereapi.com/v8/matrix?${matrixParams}`
    );

    return response.data;
    } catch (error) {
    logger.error('❌ HERE Distance Matrix failed:', error);
    throw error;
    }
    }

    /**
    * Check if the service is available
    */
    async healthCheck(): Promise<boolean> {
      if (!this.apiKey) {
      return false;
      }

      try {
      const testParams = new URLSearchParams({
      apikey: this.apiKey,
      q: 'Montreal',
      limit: '1'
      });

      const response = await this.client.get(
      `https://geocode.search.hereapi.com/v1/geocode?${testParams}`,
      { timeout: 5000 }
      );

      return response.status === 200;
      } catch (error) {
      logger.error('❌ HERE Maps health check failed:', error);
      return false;
      }
      }
      }

      export default HereGeocoding;
