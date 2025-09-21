// composables/useLoading.ts
export const useLoading = (action?: string) => {
  const uiStore = useUIStore();

  const isLoading = computed(() => {
    if (action) {
      return uiStore.loading.actions[action] || false;
    }
    return uiStore.loading.global;
  });

  const setLoading = (loading: boolean) => {
    if (action) {
      uiStore.setActionLoading(action, loading);
    } else {
      uiStore.setGlobalLoading(loading);
    }
  };

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    setLoading,
    withLoading,
  };
};
