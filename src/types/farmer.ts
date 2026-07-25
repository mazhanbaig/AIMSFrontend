export interface Farmer {
  id: string;
  userId: string;
  tenantId: string;
  name: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  governmentId?: string;
  isVerified: boolean;
  dynamicFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface LandParcel {
  id: string;
  farmerId: string;
  name: string;
  size: number;
  unit: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  cropType?: string;
  soilType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerField {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: 'text' | 'number' | 'select' | 'date' | 'file' | 'email' | 'phone' | 'textarea';
  options?: string[];
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  order: number;
  isActive: boolean;
}

export interface CreateFarmerInput {
  name: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  dateOfBirth?: string;
  governmentId?: string;
  dynamicFields?: Record<string, any>;
}

export interface CreateLandParcelInput {
  name: string;
  size: number;
  unit: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  cropType?: string;
  soilType?: string;
}
