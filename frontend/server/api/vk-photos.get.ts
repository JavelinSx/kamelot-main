/**
 * API endpoint для получения локальных фотографий галереи
 *
 * Query параметры:
 * - offset: смещение для пагинации (по умолчанию 0)
 * - count: количество фото для загрузки (по умолчанию 20)
 *
 * Возвращает:
 * - photos: массив URL фотографий
 * - hasMore: boolean - есть ли еще фото для загрузки
 * - total: общее количество фото
 * - source: 'local' - источник фотографий
 */

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Параметры пагинации
  const offset = parseInt(query.offset as string) || 0;
  const count = parseInt(query.count as string) || 20;

  // Загружаем локальные фото
  return loadLocalPhotos(offset, count);
});

/**
 * Загрузка локальных фотографий из директории public/images/gallery
 */
function loadLocalPhotos(offset: number, count: number) {
  // Список локальных фото
  // В будущем можно заменить на динамическое чтение из директории
  const localPhotos = [
    "/images/gallery/gallery-1.jpg",
    "/images/gallery/gallery-2.jpg",
    "/images/gallery/gallery-3.jpg",
    "/images/gallery/gallery-4.jpg",
    "/images/gallery/gallery-5.jpg",
    "/images/gallery/gallery-6.jpg",
    "/images/gallery/gallery-7.jpg",
    "/images/gallery/gallery-8.jpg",
    "/images/gallery/gallery-9.jpg",
    "/images/gallery/gallery-10.jpg",
    "/images/gallery/gallery-11.jpg",
    "/images/gallery/gallery-12.jpg",
    "/images/gallery/gallery-13.jpg",
    "/images/gallery/gallery-14.jpg",
    "/images/gallery/gallery-15.jpg",
    "/images/gallery/gallery-16.jpg",
    "/images/gallery/gallery-17.jpg",
    "/images/gallery/gallery-18.jpg",
    "/images/gallery/gallery-19.jpg",
    "/images/gallery/gallery-20.jpg",
    "/images/gallery/gallery-21.jpg",
    "/images/gallery/gallery-22.jpg",
  ];

  const total = localPhotos.length;
  const photos = localPhotos.slice(offset, offset + count);
  const hasMore = offset + count < total;

  return {
    photos,
    hasMore,
    total,
    source: "local",
  };
}
