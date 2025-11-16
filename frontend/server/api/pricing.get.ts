/**
 * API endpoint для получения ценовых планов из Google Sheets
 * Паттерн идентичен fights.get.ts
 */

import type { PricingPlan, PricingResponse } from "~/types";

// Типы для Google Sheets API v4
interface GoogleSheetsMetadata {
  sheets: Array<{
    properties: {
      title: string;
    };
  }>;
}

interface GoogleSheetsValues {
  values: string[][];
}

export default defineEventHandler(async (event): Promise<PricingResponse> => {
  const config = useRuntimeConfig();
  const { googleSheetsPricingId, googleSheetsApiKey } = config.public;

  if (!googleSheetsPricingId || !googleSheetsApiKey) {
    throw createError({
      statusCode: 500,
      message: "Google Sheets Pricing not configured",
    });
  }

  const plans = await loadPricingFromGoogleSheets(
    googleSheetsPricingId,
    googleSheetsApiKey
  );

  return {
    plans: plans.filter((plan) => plan.active),
    total: plans.filter((plan) => plan.active).length,
    source: "google_sheets",
    lastUpdated: new Date().toISOString(),
  };
});

/**
 * Загрузка прайсинга из Google Sheets API v4
 * Просто: API → JSON → готово!
 */
async function loadPricingFromGoogleSheets(
  sheetId: string,
  apiKey: string
): Promise<PricingPlan[]> {
  // 1. Получаем список листов
  const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
  const metadata = await $fetch<GoogleSheetsMetadata>(metadataUrl);
  const sheets = metadata.sheets || [];

  const allPlans: PricingPlan[] = [];

  // 2. Загружаем каждый лист
  for (const sheet of sheets) {
    const sheetTitle = sheet.properties?.title;
    const range = `${sheetTitle}!A:Z`;
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      range
    )}?key=${apiKey}`;

    try {
      const data = await $fetch<GoogleSheetsValues>(valuesUrl);
      const rows = data.values || [];

      if (rows.length < 2) continue; // Пропускаем пустые листы

      const headers = rows[0];
      const dataRows = rows.slice(1);

      if (!headers) continue; // Нет заголовков

      // 3. Преобразуем строки в объекты
      const plans = dataRows
        .filter((row): row is string[] => row && row.length > 0)
        .map((row) => rowToPricingPlan(headers, row))
        .filter((plan): plan is PricingPlan => plan !== null);

      allPlans.push(...plans);
    } catch (error) {
      // Silent error
    }
  }

  return allPlans;
}

/**
 * Преобразование строки из Google Sheets в объект PricingPlan
 */
function rowToPricingPlan(
  headers: string[],
  row: string[]
): PricingPlan | null {
  // Создаём объект из headers и row
  const data: Record<string, string> = {};
  headers.forEach((header, i) => {
    // Нормализуем ключ: убираем скобки, lowercase, заменяем пробелы
    const key = header
      .trim()
      .toLowerCase()
      .replace(/\(.*?\)/g, "") // Убираем текст в скобках
      .replace(/\s+/g, "_") // Заменяем пробелы на _
      .replace(/_+$/g, ""); // Убираем trailing _
    const value = row[i]?.trim();
    if (value && value !== "-") {
      data[key] = value;
    }
  });

  // Проверяем обязательные поля
  if (!data.name || !data.price || !data.type) {
    return null;
  }

  // Helper для парсинга boolean
  const parseBoolean = (value: string | undefined): boolean => {
    if (!value) return false;
    const lower = value.toLowerCase();
    return lower === "true" || lower === "1" || lower === "yes";
  };

  // Возвращаем объект
  return {
    id: data.id || String(Math.random()),
    name: data.name,
    price: Number(data.price) || 0,
    sessions_count: Number(data.sessions_count || data.session_count) || -1,
    description: data.description || "",
    type: (data.type || "single") as any,
    trainer_limited: parseBoolean(data.trainer_limited || data.trainer_limit),
    trial_allowed: parseBoolean(data.trial_allowed),
    active: parseBoolean(data.active),
    valid_days: data.valid_days ? Number(data.valid_days) : undefined,
  };
}
