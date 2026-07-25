export type ClaimStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'INVESTIGATION' | 'APPROVED' | 'REJECTED' | 'PAID';
export type ClaimPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Claim {
  id: string;
  claimNumber: string;
  farmerId: string;
  farmer?: any;
  policyId: string;
  policy?: any;
  status: ClaimStatus;
  priority: ClaimPriority;
  title: string;
  description: string;
  incidentDate: string;
  reportedDate: string;
  estimatedLoss: number;
  estimatedLossCurrency: string;
  approvedAmount?: number;
  approvedAmountCurrency?: string;
  assignedTo?: string;
  assignedToUser?: any;
  fraudScore?: number;
  fraudVerdict?: string;
  fraudDetails?: any;
  documents?: ClaimDocument[];
  notes?: ClaimNote[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimDocument {
  id: string;
  claimId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}

export interface ClaimNote {
  id: string;
  claimId: string;
  userId: string;
  userName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface CreateClaimInput {
  policyId: string;
  title: string;
  description: string;
  incidentDate: string;
  estimatedLoss: number;
  estimatedLossCurrency?: string;
  documents?: File[];
}

export interface UpdateClaimStatusInput {
  status: ClaimStatus;
  approvedAmount?: number;
  notes?: string;
}

export interface AssignClaimInput {
  assignedTo: string;
}
