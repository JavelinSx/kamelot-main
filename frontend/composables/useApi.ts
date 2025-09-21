// composables/useApi.ts - Исправленная версия
export function useApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const request = async <T = any>(
    url: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<T>(url, {
        ...options,
        onResponseError({ response }) {
          throw new Error(response._data?.message || "Ошибка сервера");
        },
      });

      return response;
    } catch (err: any) {
      error.value = err.message || "Произошла ошибка";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const get = <T = any>(url: string, options?: Parameters<typeof $fetch>[1]) =>
    request<T>(url, { ...options, method: "GET" });

  const post = <T = any>(
    url: string,
    body?: any,
    options?: Parameters<typeof $fetch>[1]
  ) => request<T>(url, { ...options, method: "POST", body });

  const put = <T = any>(
    url: string,
    body?: any,
    options?: Parameters<typeof $fetch>[1]
  ) => request<T>(url, { ...options, method: "PUT", body });

  const patch = <T = any>(
    url: string,
    body?: any,
    options?: Parameters<typeof $fetch>[1]
  ) => request<T>(url, { ...options, method: "PATCH", body });

  const del = <T = any>(url: string, options?: Parameters<typeof $fetch>[1]) =>
    request<T>(url, { ...options, method: "DELETE" });

  return {
    loading: readonly(loading),
    error: readonly(error),
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}
