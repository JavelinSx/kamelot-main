/**
 * API endpoint для получения анонсов боёв из Google Sheets
 */

import type { FightAnnouncement, FightsResponse } from "~/types/fight";

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

export default defineEventHandler(async (event): Promise<FightsResponse> => {
  const config = useRuntimeConfig();
  const { googleSheetsId, googleSheetsApiKey } = config.public;

  if (!googleSheetsId || !googleSheetsApiKey) {
    throw createError({ statusCode: 500, message: 'Google Sheets not configured' });
  }

  const fights = await loadFightsFromGoogleSheets(googleSheetsId, googleSheetsApiKey);

  return {
    fights,
    total: fights.length,
    source: "google_sheets" as any,
    lastUpdated: new Date().toISOString(),
  };
});

/**
 * Загрузка боёв из Google Sheets API v4
 * Просто: API → JSON → готово!
 */
async function loadFightsFromGoogleSheets(
  sheetId: string,
  apiKey: string
): Promise<FightAnnouncement[]> {
  // 1. Получаем список листов
  const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
  const metadata = await $fetch<GoogleSheetsMetadata>(metadataUrl);
  const sheets = metadata.sheets || [];

  const allFights: FightAnnouncement[] = [];

  // 2. Загружаем каждый лист
  for (const sheet of sheets) {
    const sheetTitle = sheet.properties?.title;
    const range = `${sheetTitle}!A:Z`;
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    try {
      const data = await $fetch<GoogleSheetsValues>(valuesUrl);
      const rows = data.values || [];

      if (rows.length < 2) continue; // Пропускаем пустые листы

      const headers = rows[0];
      const dataRows = rows.slice(1);

      if (!headers) continue; // Нет заголовков

      // 3. Преобразуем строки в объекты
      const fights = dataRows
        .filter((row): row is string[] => row && row.length > 0)
        .map(row => rowToFight(headers, row))
        .filter((fight): fight is FightAnnouncement => fight !== null);

      allFights.push(...fights);
    } catch (error) {
      // Silent error
    }
  }

  return allFights;
}

/**
 * Преобразование строки из Google Sheets в объект FightAnnouncement
 */
function rowToFight(headers: string[], row: string[]): FightAnnouncement | null {
  // Создаём объект из headers и row
  const data: Record<string, string> = {};
  headers.forEach((header, i) => {
    // Убираем всё что в скобках, затем нормализуем
    const key = header
      .trim()
      .toLowerCase()
      .replace(/\(.*?\)/g, '') // Убираем текст в скобках
      .replace(/\s+/g, '_')    // Заменяем пробелы на _
      .replace(/_+$/g, '');    // Убираем trailing _
    const value = row[i]?.trim();
    if (value && value !== '-') {
      data[key] = value;
    }
  });

  // Проверяем обязательные поля
  if (!data.event_name || !data.date) return null;

  // Возвращаем объект
  return {
    id: data.id || String(Math.random()),
    status: (data.status || 'upcoming') as any,
    event_name: data.event_name,
    fight_type: (data.fight_type || 'MMA') as any,
    date: data.date,
    time: data.time,
    location: data.location || '',
    fighter1_name: data.fighter1_name || '',
    fighter1_club: data.fighter1_club,
    fighter1_record: data.fighter1_record,
    fighter2_name: data.fighter2_name || '',
    fighter2_club: data.fighter2_club,
    fighter2_record: data.fighter2_record,
    weight_class: data.weight_class,
    rounds: data.rounds ? Number(data.rounds) : undefined,
    title_fight: data.title_fight as any,
    description: data.description,
    poster_url: data.poster_url,
    tickets_url: data.tickets_url,
    stream_url: data.stream_url,
    result: data.result,
    highlight_url: data.highlight_url,
  };
}
