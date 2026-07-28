export interface Farmer {
  id: string;
  userId: string;
  tenantId: string;
  fullName: string;
  guardianName?: string;
  cnicNumber: string;
  address?: string;
  city?: string;
  province?: string;
  dateOfBirth?: string;
  gender?: string;
  bankName?: string;
  bankAccountNumber?: string;
  accountTitle?: string;
  profilePhotoUrl?: string;
  customData?: Record<string, any>;
  createdAt: string;
}

export interface LandParcel {
  id: string;
  farmerId: string;
  tenantId: string;
  landTitleNumber?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  areaAcres: number;
  soilType?: string;
  cropType: string;
  irrigationType?: string;
  ownershipType?: string;
  district?: string;
  createdAt: string;
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
  fullName: string;
  guardianName?: string;
  cnicNumber: string;
  address?: string;
  city?: string;
  province?: string;
  dateOfBirth?: string;
  gender?: string;
  bankName?: string;
  bankAccountNumber?: string;
  accountTitle?: string;
  profilePhotoUrl?: string;
  customData?: Record<string, any>;
}

export interface CreateLandParcelInput {
  landTitleNumber?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  areaAcres: number;
  soilType?: string;
  cropType: string;
  irrigationType?: string;
  ownershipType?: string;
  district?: string;
}
