/**
 * API endpoint для получения фотографий из альбома VK
 *
 * Query параметры:
 * - offset: смещение для пагинации (по умолчанию 0)
 * - count: количество фото для загрузки (по умолчанию 20)
 *
 * Возвращает:
 * - photos: массив URL фотографий в максимальном разрешении
 * - hasMore: boolean - есть ли еще фото для загрузки
 * - total: общее количество фото в альбоме
 * - source: 'vk' | 'local' - источник фотографий
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  // Параметры пагинации
  const offset = parseInt(query.offset as string) || 0;
  const count = parseInt(query.count as string) || 20;

  // Проверяем, настроены ли ключи VK API
  const vkAccessToken = config.vkAccessToken;
  const vkGroupId = config.vkGroupId;
  const vkAlbumId = config.vkAlbumId;

  const hasVkConfig = vkAccessToken &&
                      vkGroupId &&
                      vkAlbumId &&
                      vkAccessToken !== 'your_vk_access_token_here';

  // Если VK API не настроен, возвращаем локальные фото
  if (!hasVkConfig) {
    console.log('[VK Photos API] VK API не настроен, используем локальные фото');
    return useLocalPhotos(offset, count);
  }

  try {
    // Формируем запрос к VK API
    const vkApiUrl = 'https://api.vk.com/method/photos.get';
    const params = new URLSearchParams({
      owner_id: vkGroupId,
      album_id: vkAlbumId,
      access_token: vkAccessToken,
      v: '5.131', // Версия VK API
      offset: offset.toString(),
      count: count.toString(),
      photo_sizes: '1', // Получаем все размеры фото
    });

    const response = await fetch(`${vkApiUrl}?${params.toString()}`);
    const data = await response.json();

    // Проверяем на ошибки VK API
    if (data.error) {
      console.error('[VK Photos API] Ошибка VK API:', data.error);
      throw new Error(data.error.error_msg);
    }

    if (!data.response) {
      throw new Error('Некорректный ответ от VK API');
    }

    const items = data.response.items || [];
    const total = data.response.count || 0;

    // Извлекаем URL фотографий в максимальном разрешении
    const photos = items.map((item: any) => {
      // VK API возвращает массив размеров, берем самый большой
      const sizes = item.sizes || [];
      if (sizes.length === 0) return null;

      // Находим размер с максимальной площадью
      const largestSize = sizes.reduce((prev: any, current: any) => {
        const prevArea = (prev.width || 0) * (prev.height || 0);
        const currentArea = (current.width || 0) * (current.height || 0);
        return currentArea > prevArea ? current : prev;
      });

      return largestSize.url;
    }).filter((url: string | null) => url !== null);

    return {
      photos,
      hasMore: offset + count < total,
      total,
      source: 'vk',
    };

  } catch (error: any) {
    console.error('[VK Photos API] Ошибка при загрузке фото из VK:', error.message);

    // В случае ошибки возвращаем локальные фото
    console.log('[VK Photos API] Переключаемся на локальные фото');
    return useLocalPhotos(offset, count);
  }
});

/**
 * Вспомогательная функция для загрузки локальных фото
 */
function useLocalPhotos(offset: number, count: number) {
  // Список локальных фото (можно заменить на динамическое чтение из директории)
  const localPhotos = [
    '/images/gallery/gallery-1.jpg',
    '/images/gallery/gallery-2.jpg',
    '/images/gallery/gallery-3.jpg',
    '/images/gallery/gallery-4.jpg',
    '/images/gallery/gallery-5.jpg',
    '/images/gallery/gallery-6.jpg',
    '/images/gallery/gallery-7.jpg',
    '/images/gallery/gallery-8.jpg',
    '/images/gallery/gallery-9.jpg',
    '/images/gallery/gallery-10.jpg',
    '/images/gallery/gallery-11.jpg',
    '/images/gallery/gallery-12.jpg',
    '/images/gallery/gallery-13.jpg',
    '/images/gallery/gallery-14.jpg',
    '/images/gallery/gallery-15.jpg',
    '/images/gallery/gallery-16.jpg',
    '/images/gallery/gallery-17.jpg',
    '/images/gallery/gallery-18.jpg',
    '/images/gallery/gallery-19.jpg',
    '/images/gallery/gallery-20.jpg',
  ];

  const total = localPhotos.length;
  const photos = localPhotos.slice(offset, offset + count);
  const hasMore = offset + count < total;

  return {
    photos,
    hasMore,
    total,
    source: 'local',
  };
}
