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

  const {
    data: processingDaysHistogram,
    isLoading: isProcessingDaysHistogramLoading,
  } = useQuery({
    queryKey: ['processingDaysHistogram'],
    queryFn: () => apiService.getProcessingDaysHistogram(),
    staleTime: 5 * 60 * 1000,
  });

    const {
    data: delayShare,
    isLoading: isDelayShareLoading,
  } = useQuery({
    queryKey: ['delayShare'],
    queryFn: () => apiService.getDelayShare(),
    staleTime: 5 * 60 * 1000,
  });

    const {
    data: monthlyAverageDelay,
    isLoading: isMonthlyDelayLoading,
  } = useQuery({
    queryKey: ['monthlyAverageDelay'],
    queryFn: () => apiService.getMonthlyAverageDelay(),
    staleTime: 5 * 60 * 1000,
  });

    const {
    data: lineAverageDelay,
    isLoading: isLineAverageDelayLoading,
  } = useQuery({
    queryKey: ['lineAverageDelay'],
    queryFn: () => apiService.getLineAverageDelay(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: lineMonthlyAverageDelay,
    isLoading: isLineMonthlyAverageDelayLoading,
  } = useQuery({
    queryKey: ['lineMonthlyAverageDelay'],
    queryFn: () => apiService.getLineMonthlyAverageDelay(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: delayedBatchesByLine,
    isLoading: isDelayedBatchesByLineLoading,
  } = useQuery({
    queryKey: ['delayedBatchesByLine'],
    queryFn: () => apiService.getDelayedBatchesByLine(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: delayedVsTotalBatches,
    isLoading: isDelayedVsTotalBatchesLoading,
  } = useQuery({
    queryKey: ['delayedVsTotalBatches'],
    queryFn: () => apiService.getDelayedVsTotalBatches(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: topDelayFormulas,
    isLoading: isTopDelayFormulasLoading,
  } = useQuery({
    queryKey: ['topDelayFormulas'],
    queryFn: () => apiService.getTopDelayFormulas(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: lineScrapFactor,
    isLoading: isLineScrapFactorLoading,
  } = useQuery({
    queryKey: ['lineScrapFactor'],
    queryFn: () => apiService.getLineScrapFactor(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: monthlyDelayRate,
    isLoading: isMonthlyDelayRateLoading,
  } = useQuery({
    queryKey: ['monthlyDelayRate'],
    queryFn: () => apiService.getMonthlyDelayRate(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: delayReasonsByLine,
    isLoading: isDelayReasonsByLineLoading,
  } = useQuery({
    queryKey: ['delayReasonsByLine'],
    queryFn: () => apiService.getDelayReasonsByLine(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: topDelayReasons,
    isLoading: isTopDelayReasonsLoading,
  } = useQuery({
    queryKey: ['topDelayReasons'],
    queryFn: () => apiService.getTopDelayReasons(),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isBatchLoading || isDelayLoading || isScrapLoading ||
                   isYieldLoading || isTrendsLoading || isReasonsLoading || isDelayShareLoading || isMonthlyDelayLoading || isLineAverageDelayLoading || isLineMonthlyAverageDelayLoading || isDelayedBatchesByLineLoading || isDelayedVsTotalBatchesLoading || isTopDelayFormulasLoading || isLineScrapFactorLoading || isMonthlyDelayRateLoading || isDelayReasonsByLineLoading || isTopDelayReasonsLoading || isProcessingDaysHistogramLoading;

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
    processingDaysHistogram,
    delayShare,
    monthlyAverageDelay,
    lineAverageDelay,
    lineMonthlyAverageDelay,
    delayedBatchesByLine,
    delayedVsTotalBatches,
    topDelayFormulas,
    lineScrapFactor,
    monthlyDelayRate,
    delayReasonsByLine,
    topDelayReasons,
    isLoading,
    error: batchError,
    refetch: refetchAll,
  };
};
