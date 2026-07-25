'use client';

import { useQuery } from '@tanstack/react-query';
import { claimApi, settingsApi } from '@/lib/api-client';

export function useFraudAnalysis(claimId: string) {
  return useQuery({
    queryKey: ['fraud-analysis', claimId],
    queryFn: async () => {
      const response = await claimApi.getFraudAnalysis(claimId);
      return response.data;
    },
    enabled: !!claimId,
  });
}

export function useFraudTier() {
  return useQuery({
    queryKey: ['fraud-tier'],
    queryFn: async () => {
      const response = await settingsApi.getFraudTier();
      return response.data;
    },
  });
}

/**
 * Get color for fraud score
 */
export function getFraudScoreColor(score: number): string {
  if (score < 30) return 'text-green-600';
  if (score < 60) return 'text-yellow-600';
  if (score < 80) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get background color for fraud score
 */
export function getFraudScoreBgColor(score: number): string {
  if (score < 30) return 'bg-green-100';
  if (score < 60) return 'bg-yellow-100';
  if (score < 80) return 'bg-orange-100';
  return 'bg-red-100';
}

/**
 * Get label for fraud verdict
 */
export function getFraudVerdictLabel(verdict: string): string {
  const labels: Record<string, string> = {
    LOW_RISK: 'Low Risk',
    MEDIUM_RISK: 'Medium Risk',
    HIGH_RISK: 'High Risk',
    FRAUDULENT: 'Fraudulent',
  };
  return labels[verdict] || verdict;
}
