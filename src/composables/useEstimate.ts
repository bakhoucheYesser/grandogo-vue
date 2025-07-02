import { computed } from 'vue';
import { useEstimateStore } from '@/stores/estimate.store';

export function useEstimate() {
  const estimateStore = useEstimateStore();

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const estimateStatus = computed(() => {
    if (estimateStore.isCalculating) return 'calculating';
    if (estimateStore.error) return 'error';
    if (estimateStore.currentEstimate) return 'complete';
    if (estimateStore.canCalculateEstimate) return 'ready';
    return 'incomplete';
  });

  const estimateStatusText = computed(() => {
    switch (estimateStatus.value) {
      case 'calculating':
        return 'Calculating your estimate...';
      case 'error':
        return estimateStore.error || 'An error occurred';
      case 'complete':
        return 'Estimate ready!';
      case 'ready':
        return 'Ready to calculate estimate';
      default:
        return 'Enter pickup and destination addresses';
    }
  });

  return {
    // Store
    ...estimateStore,

    // Computed
    estimateStatus,
    estimateStatusText,

    // Utilities
    formatPrice,
    formatDistance,
    formatDuration,
  };
}
