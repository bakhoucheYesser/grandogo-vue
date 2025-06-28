export interface ProviderRegistrationData {
  user: {
    userType: string
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  };
  provider: {
    companyName?: string;
    businessLicense?: string;
    taxId?: string;
    serviceAreaRadius?: number;
  };
  vehicle: {
    make: string;
    model: string;
    year: string;
    color?: string;
    type: string;
    licensePlate: string;
  };
}

export interface ProviderRegistrationResponse {
  message: string;
  provider: {
    id: number;
    uuid: string;
    // Other provider fields
  };
}
