// composables/usePricing.ts
import type { PricingPlan, PricingResponse } from "~/types";

export const usePricing = () => {
  const pricingPlans = useState<PricingPlan[]>("pricingPlans", () => []);
  const selectedPlan = useState<PricingPlan | null>("selectedPlan", () => null);
  const selectedTrainerId = useState<number | null>(
    "selectedTrainerId",
    () => null
  );
  const isLoading = useState<boolean>("pricingLoading", () => false);
  const error = useState<string | null>("pricingError", () => null);

  // Загрузить планы из API
  const fetchPricingPlans = async () => {
    if (pricingPlans.value.length > 0) {
      return pricingPlans.value; // Кеш
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<PricingResponse>("/api/pricing");
      pricingPlans.value = response.plans;
      return response.plans;
    } catch (e: any) {
      error.value = e.message || "Failed to load pricing plans";
      console.error("Error fetching pricing plans:", e);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Выбрать план
  const setSelectedPlan = (plan: PricingPlan | null) => {
    selectedPlan.value = plan;

    // Если это не "Безлимит к тренеру", очищаем выбор тренера
    if (plan?.type !== "unlimited_trainer") {
      selectedTrainerId.value = null;
    }
  };

  // Выбрать тренера (для "Безлимит к тренеру")
  const setSelectedTrainerId = (trainerId: number | null) => {
    selectedTrainerId.value = trainerId;
  };

  // Рассчитать цену за тренировку
  const calculatePricePerSession = (plan: PricingPlan) => {
    if (plan.sessions_count <= 0) return null;
    return Math.round(plan.price / plan.sessions_count);
  };

  // Рассчитать экономию по сравнению с разовыми
  const calculateSavings = (plan: PricingPlan) => {
    if (plan.type === "single" || plan.sessions_count <= 0) return 0;
    const singlePrice = 900;
    const wouldPay = singlePrice * plan.sessions_count;
    return wouldPay - plan.price;
  };

  // Проверить, использовал ли пользователь пробное занятие
  const checkTrialUsed = (phoneNumber: string): boolean => {
    if (process.client) {
      const key = `trial_used_${phoneNumber.replace(/\D/g, "")}`;
      return !!localStorage.getItem(key);
    }
    return false;
  };

  // Отметить пробное занятие как использованное
  const markTrialAsUsed = (phoneNumber: string) => {
    if (process.client) {
      const key = `trial_used_${phoneNumber.replace(/\D/g, "")}`;
      localStorage.setItem(key, new Date().toISOString());
    }
  };

  // Получить доступные планы (фильтруем пробное если использовано)
  const getAvailablePlans = (phoneNumber?: string) => {
    let plans = pricingPlans.value;

    // Если номер указан, проверяем использование пробного
    if (phoneNumber && checkTrialUsed(phoneNumber)) {
      plans = plans.filter((p) => p.type !== "trial");
    }

    return plans;
  };

  // Очистить выбранный план
  const clearSelection = () => {
    selectedPlan.value = null;
    selectedTrainerId.value = null;
  };

  return {
    // State
    pricingPlans,
    selectedPlan,
    selectedTrainerId,
    isLoading,
    error,

    // Methods
    fetchPricingPlans,
    setSelectedPlan,
    setSelectedTrainerId,
    calculatePricePerSession,
    calculateSavings,
    checkTrialUsed,
    markTrialAsUsed,
    getAvailablePlans,
    clearSelection,
  };
};
