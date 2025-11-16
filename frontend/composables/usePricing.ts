// composables/usePricing.ts
import type { PricingPlan } from "~/types";

export const usePricing = () => {
  // Получаем config один раз при инициализации composable
  const config = useRuntimeConfig();
  const googleSheetsPricingId = config.public.googleSheetsPricingId;
  const googleSheetsApiKey = config.public.googleSheetsApiKey;

  const pricingPlans = useState<PricingPlan[]>("pricingPlans", () => []);
  const selectedPlan = useState<PricingPlan | null>("selectedPlan", () => null);
  const selectedTrainerId = useState<number | null>(
    "selectedTrainerId",
    () => null
  );
  const isLoading = useState<boolean>("pricingLoading", () => false);
  const error = useState<string | null>("pricingError", () => null);

  /**
   * Загрузка планов из Google Sheets API v4
   * Просто: API → JSON → готово!
   */
  const loadPricingPlans = async (): Promise<PricingPlan[]> => {
    try {
      if (!googleSheetsPricingId || !googleSheetsApiKey) {
        return [];
      }

      // 1. Получаем метаданные таблицы
      const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsPricingId}?key=${googleSheetsApiKey}`;
      const metadataResponse = await fetch(metadataUrl);

      if (!metadataResponse.ok) {
        return [];
      }

      const metadata = await metadataResponse.json();
      const sheets = metadata.sheets || [];

      const allPlans: PricingPlan[] = [];

      // 2. Загружаем данные из каждого листа
      for (const sheet of sheets) {
        const sheetTitle = sheet.properties?.title || "Untitled";

        try {
          const range = `${sheetTitle}!A:Z`;
          const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsPricingId}/values/${encodeURIComponent(
            range
          )}?key=${googleSheetsApiKey}`;

          const valuesResponse = await fetch(valuesUrl);

          if (!valuesResponse.ok) {
            continue;
          }

          const valuesData = await valuesResponse.json();
          const rows = valuesData.values || [];

          if (rows.length < 2) {
            continue;
          }

          // Первая строка - заголовки
          const headers = rows[0];

          // Остальные строки - данные
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            // Создаём объект из заголовков и значений
            const rowData: Record<string, string> = {};
            headers.forEach((header: string, index: number) => {
              const value = row[index]?.trim() || "";
              if (value && value !== "-") {
                rowData[header.trim()] = value;
              }
            });

            // Нормализуем ключи
            const cleanData: Record<string, string> = {};
            Object.keys(rowData).forEach((key) => {
              const cleanKey = key
                .trim()
                .toLowerCase()
                .replace(/\(.*?\)/g, "") // Убираем текст в скобках
                .replace(/\s+/g, "_") // Заменяем пробелы на _
                .replace(/_+$/g, ""); // Убираем trailing _
              const value = rowData[key];
              if (value !== undefined) {
                cleanData[cleanKey] = value;
              }
            });

            // Проверяем обязательные поля
            if (cleanData.name && cleanData.price && cleanData.type) {
              const plan = convertToPricingPlan(cleanData);
              if (plan) {
                allPlans.push(plan);
              }
            }
          }
        } catch (error) {
          continue;
        }
      }

      return allPlans;
    } catch (error) {
      return [];
    }
  };

  /**
   * Преобразование данных из формата Google Sheets в формат PricingPlan
   */
  const convertToPricingPlan = (data: any): PricingPlan | null => {
    const parseBoolean = (value: string | undefined): boolean => {
      if (!value) return false;
      const lower = value.toLowerCase();
      return lower === "true" || lower === "1" || lower === "yes";
    };

    return {
      id: data.id || String(Math.random()),
      name: data.name,
      price: Number(data.price) || 0,
      sessions_count:
        Number(data.sessions_count || data.session_count) || -1,
      description: data.description || "",
      type: (data.type || "single") as any,
      trainer_limited: parseBoolean(
        data.trainer_limited || data.trainer_limit
      ),
      trial_allowed: parseBoolean(data.trial_allowed),
      active: parseBoolean(data.active),
      valid_days: data.valid_days ? Number(data.valid_days) : undefined,
    };
  };

  // Загрузить планы с кешированием
  const fetchPricingPlans = async () => {
    if (pricingPlans.value.length > 0) {
      return pricingPlans.value; // Кеш
    }

    isLoading.value = true;
    error.value = null;

    try {
      const allPlans = await loadPricingPlans();
      // Фильтруем только активные планы
      const activePlans = allPlans.filter((plan) => plan.active);
      pricingPlans.value = activePlans;
      return activePlans;
    } catch (e: any) {
      error.value = e.message || "Failed to load pricing plans";
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
