/**
 * API endpoint для получения анонсов боёв из Google Sheets
 *
 * Возвращает:
 * - fights: массив анонсов боёв
 * - total: общее количество боёв
 * - source: 'google_sheets' | 'local' - источник данных
 */

import type { FightAnnouncement, FightsResponse } from "~/types/fight";

export default defineEventHandler(async (event): Promise<FightsResponse> => {
  const config = useRuntimeConfig();

  // URL к Google Sheets (ID таблицы)
  const googleSheetsId = config.public.googleSheetsId;

  // Если URL не настроен, возвращаем локальные данные
  if (!googleSheetsId) {
    return {
      fights: getLocalFights(),
      total: getLocalFights().length,
      source: "local",
    };
  }

  try {
    // Загружаем данные из Google Sheets
    const fights = await loadFightsFromGoogleSheets(googleSheetsId);

    return {
      fights,
      total: fights.length,
      source: "google_sheets" as any,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error: any) {
    // В случае ошибки возвращаем локальные данные
    return {
      fights: getLocalFights(),
      total: getLocalFights().length,
      source: "local",
    };
  }
});

/**
 * Загрузка боёв из Google Sheets через CSV экспорт
 */
async function loadFightsFromGoogleSheets(
  sheetId: string
): Promise<FightAnnouncement[]> {
  // Формируем URL для экспорта Google Sheets в CSV
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  // Скачиваем CSV файл
  const response = await fetch(csvUrl);

  if (!response.ok) {
    throw new Error(`Failed to download CSV: ${response.statusText}`);
  }

  // Получаем текст CSV
  const csvText = await response.text();

  // Парсим CSV в массив боёв
  const fights = parseCSVToFights(csvText);

  return fights;
}

/**
 * Парсинг CSV в массив боёв
 * Формат: вертикальный - колонка A содержит названия полей, колонка B - значения
 */
function parseCSVToFights(csvText: string): FightAnnouncement[] {
  const lines = csvText.split("\n").filter((line) => line.trim());

  if (lines.length < 2) {
    console.warn("[Fights API] CSV file is empty or has no data rows");
    return [];
  }

  // Создаём объект из пар ключ-значение (вертикальный формат)
  const fightData: Record<string, string> = {};

  for (let i = 0; i < lines.length; i++) {
    try {
      const line = lines[i];
      if (!line) continue;

      const values = parseCSVLine(line);

      if (values.length >= 2 && values[0] && values[1]) {
        // Первая колонка - название поля, вторая - значение
        let fieldName = values[0].trim();
        const fieldValue = values[1].trim();

        // Очищаем название поля от дополнительных описаний в скобках
        // Например: "status(upcoming, completed, cancelled)" -> "status"
        const splitField = fieldName.split("(")[0];
        if (splitField) {
          fieldName = splitField.trim();
        }

        // Также убираем описания типов
        fieldName = fieldName.replace(/\s*\(.+?\)\s*/g, "");

        // Игнорируем пустые значения и "-"
        if (
          fieldName &&
          fieldValue &&
          fieldValue !== "" &&
          fieldValue !== "-"
        ) {
          fightData[fieldName] = fieldValue;
        }
      }
    } catch (error) {
      console.error(`[Fights API] Error parsing line ${i}:`, error);
    }
  }

  // Парсим собранные данные в объект FightAnnouncement
  const fight = parseFightData(fightData, 1);

  if (fight) {
    return [fight];
  }

  return [];
}

/**
 * Парсинг строки CSV с учетом кавычек
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : undefined;

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current);

  return result;
}

/**
 * Парсинг данных боя из объекта
 */
function parseFightData(
  data: Record<string, string>,
  rowNumber: number
): FightAnnouncement | null {
  // Очищаем названия полей от пробелов и приводим к нижнему регистру для сравнения
  const cleanData: Record<string, string> = {};
  Object.keys(data).forEach((key) => {
    const cleanKey = key.trim().toLowerCase().replace(/\s+/g, "_");
    const value = data[key];
    if (value !== undefined) {
      cleanData[cleanKey] = value;
    }
  });

  // Проверяем обязательные поля
  if (!cleanData.event_name || !cleanData.date) {
    console.warn(
      `[Fights API] Row ${rowNumber} missing required fields (event_name or date)`
    );
    return null;
  }

  // Формируем объект боя
  const fight: FightAnnouncement = {
    id: cleanData.id || String(rowNumber),
    status: (cleanData.status || "upcoming") as any,
    event_name: String(cleanData.event_name),
    fight_type: (cleanData.fight_type || "MMA") as any,
    date: String(cleanData.date),
    time: cleanData.time || undefined,
    location: cleanData.location || "",
    fighter1_name: cleanData.fighter1_name || "",
    fighter1_club: cleanData.fighter1_club || undefined,
    fighter1_record: cleanData.fighter1_record || undefined,
    fighter2_name: cleanData.fighter2_name || "",
    fighter2_club: cleanData.fighter2_club || undefined,
    fighter2_record: cleanData.fighter2_record || undefined,
    weight_class: cleanData.weight_class || undefined,
    rounds: cleanData.round
      ? Number(cleanData.round)
      : cleanData.rounds
      ? Number(cleanData.rounds)
      : undefined,
    title_fight: cleanData.title_fight as any,
    description: cleanData.description || undefined,
    poster_url: cleanData.poster_url || undefined,
    tickets_url: cleanData.tickets_url || undefined,
    stream_url: cleanData.stream_url || undefined,
    result: cleanData.result || undefined,
    highlight_url: cleanData.highlight_url || undefined,
  };

  return fight;
}

/**
 * Локальные данные боёв (fallback)
 */
function getLocalFights(): FightAnnouncement[] {
  return [
    {
      id: 1,
      status: "upcoming",
      event_name: "Bears FC 3",
      fight_type: "MMA",
      date: "2025-12-20",
      time: "19:00",
      location: 'Москва, Спорткомплекс "Олимпийский"',
      fighter1_name: "Султонов Нажмиддин",
      fighter1_club: "Kamelot FC",
      fighter1_record: "5-1-0",
      fighter2_name: "Алексей Смирнов",
      fighter2_club: "Tigers MMA",
      fighter2_record: "7-2-0",
      weight_class: "Легкий вес (до 70 кг)",
      rounds: 3,
      title_fight: "yes",
      description: "Титульный бой за пояс Bears FC",
      poster_url: "/images/fights/bears-fc-3.jpg",
    },
  ];
}
