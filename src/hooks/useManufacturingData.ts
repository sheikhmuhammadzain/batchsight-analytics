import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

export const useManufacturingData = () => {
  const {
    data: batchData,
    isLoading: isBatchLoading,
    error: batchError,
    refetch: refetchBatch
  } = useQuery({
    queryKey: ['batchData'],
    queryFn: () => apiService.getProcessedBatchData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  const {
    data: delayAnalytics,
    isLoading: isDelayLoading,
  } = useQuery({
    queryKey: ['delayAnalytics'],
    queryFn: () => apiService.getDelayAnalytics(),
    enabled: !!batchData,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: scrapAnalytics,
    isLoading: isScrapLoading,
  } = useQuery({
    queryKey: ['scrapAnalytics'],
    queryFn: () => apiService.getScrapAnalytics(),
    enabled: !!batchData,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: yieldAnalytics,
    isLoading: isYieldLoading,
  } = useQuery({
    queryKey: ['yieldAnalytics'],
    queryFn: () => apiService.getYieldAnalytics(),
    enabled: !!batchData,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: monthlyTrends,
    isLoading: isTrendsLoading,
  } = useQuery({
    queryKey: ['monthlyTrends'],
    queryFn: () => apiService.getMonthlyTrends(),
    enabled: !!batchData,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: delayReasons,
    isLoading: isReasonsLoading,
  } = useQuery({
    queryKey: ['delayReasons'],
    queryFn: () => apiService.getDelayReasons(),
    enabled: !!batchData,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isBatchLoading || isDelayLoading || isScrapLoading || 
                   isYieldLoading || isTrendsLoading || isReasonsLoading;

  const refetchAll = async () => {
    await refetchBatch();
  };

  return {
    batchData,
    delayAnalytics,
    scrapAnalytics,
    yieldAnalytics,
    monthlyTrends,
    delayReasons,
    isLoading,
    error: batchError,
    refetch: refetchAll,
  };
};
