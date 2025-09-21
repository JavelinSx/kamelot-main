// composables/useAuth.ts
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UpdateUserData,
  User,
} from "@/types";

export const useAuth = () => {
  const user = ref<User | undefined>(undefined);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isTrainer = computed(() => user.value?.role === "trainer");

  // Типизированная функция для работы с токеном
  const useAuthToken = () => {
    return useCookie<string | null>("auth-token", {
      default: () => null,
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  };

  // Типизированная функция для refresh токена
  const useRefreshToken = () => {
    return useCookie<string | null>("refresh-token", {
      default: () => null,
      maxAge: 60 * 60 * 24 * 30, // 30 дней
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  };

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      user.value = response.user;

      // Сохраняем токены
      const accessToken = useAuthToken();
      const refreshToken = useRefreshToken();

      accessToken.value = response.tokens.accessToken;
      refreshToken.value = response.tokens.refreshToken;

      return response;
    } catch (err: any) {
      error.value = err.data?.message || err.message || "Ошибка входа";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: RegisterData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: data,
      });

      user.value = response.user;

      // Сохраняем токены
      const accessToken = useAuthToken();
      const refreshToken = useRefreshToken();

      accessToken.value = response.tokens.accessToken;
      refreshToken.value = response.tokens.refreshToken;

      return response;
    } catch (err: any) {
      error.value = err.data?.message || err.message || "Ошибка регистрации";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;

    try {
      // Отправляем запрос на выход с токеном
      const accessToken = useAuthToken();
      if (accessToken.value) {
        await $fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Очищаем состояние
      user.value = undefined;

      // Удаляем токены
      const accessToken = useAuthToken();
      const refreshToken = useRefreshToken();
      accessToken.value = null;
      refreshToken.value = null;

      loading.value = false;

      // Перенаправляем на главную
      await navigateTo("/");
    }
  };

  const fetchUser = async () => {
    const accessToken = useAuthToken();

    if (!accessToken.value) {
      return null;
    }

    try {
      loading.value = true;
      const response = await $fetch<ApiResponse<User>>("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });

      user.value = response.data;
      return response.data;
    } catch (err) {
      console.error("Fetch user error:", err);

      // Попытка обновить токен
      const refreshed = await refreshTokens();
      if (!refreshed) {
        // Токен невалидный, очищаем
        const accessToken = useAuthToken();
        const refreshToken = useRefreshToken();
        accessToken.value = null;
        refreshToken.value = null;
        user.value = undefined;
      }
      return null;
    } finally {
      loading.value = false;
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    const refreshToken = useRefreshToken();

    if (!refreshToken.value) {
      return false;
    }

    try {
      const response = await $fetch<{
        tokens: { accessToken: string; refreshToken: string };
      }>("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken.value}`,
        },
      });

      // Обновляем токены
      const accessToken = useAuthToken();
      accessToken.value = response.tokens.accessToken;
      refreshToken.value = response.tokens.refreshToken;

      return true;
    } catch (err) {
      console.error("Token refresh error:", err);
      return false;
    }
  };

  const updateProfile = async (data: UpdateUserData) => {
    loading.value = true;
    error.value = null;

    try {
      const accessToken = useAuthToken();

      if (!accessToken.value) {
        throw new Error("Токен авторизации не найден");
      }

      const response = await $fetch<ApiResponse<User>>("/api/auth/profile", {
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });

      user.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value =
        err.data?.message || err.message || "Ошибка обновления профиля";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  // Инициализация пользователя при создании composable
  const initAuth = async () => {
    const accessToken = useAuthToken();
    if (accessToken.value && !user.value) {
      await fetchUser();
    }
  };

  return {
    // Реактивные данные (readonly для защиты)
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),

    // Computed свойства
    isAuthenticated,
    isTrainer,

    // Методы
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    clearError,
    initAuth,
    refreshTokens,
  };
};
