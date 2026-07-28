export type ClaimStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'INVESTIGATION' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Claim {
  id: string;
  claimNumber: string;
  farmerId: string;
  farmer?: any;
  policyId: string;
  policy?: any;
  status: ClaimStatus;
  incidentType: string;
  description: string;
  incidentDate: string;
  incidentLocation?: string;
  submittedAt: string;
  claimedAmount: number;
  approvedAmount?: number;
  assignedTo?: string;
  assignedToUser?: any;
  fraudScore?: number;
  fraudVerdict?: string;
  fraudDetails?: any;
  documents?: ClaimDocument[];
  statusHistory?: ClaimStatusHistory[];
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

export interface ClaimStatusHistory {
  id: string;
  claimId: string;
  userId: string;
  fromStatus: ClaimStatus;
  toStatus: ClaimStatus;
  note?: string;
  createdAt: string;
}

export interface CreateClaimInput {
  policyId: string;
  incidentType: string;
  description: string;
  incidentDate: string;
  incidentLocation?: string;
  claimedAmount: number;
  estimatedLossPercentage?: number;
}

export interface UpdateClaimStatusInput {
  status: ClaimStatus;
  approvedAmount?: number;
  notes?: string;
}

export interface AssignClaimInput {
  assignedTo: string;
}
