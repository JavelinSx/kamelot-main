// composables/useGallery.ts

/**
 * Тип ответа от API VK Photos
 */
interface VKPhotosResponse {
  photos: string[]
  hasMore: boolean
  total: number
  source: 'vk' | 'local'
}

export const useGallery = () => {
  /**
   * Загрузка локальных изображений (старая функция, сохранена для обратной совместимости)
   */
  const loadGalleryImages = () => {
    try {
      // Автоматический импорт всех изображений из public
      // eager: true делает импорт синхронным на этапе билда
      const modules = (import.meta as any).glob(
        "/public/images/gallery/*.{png,jpg,jpeg,webp}",
        {
          eager: true,
          query: "?url",
        }
      );

      const images = Object.values(modules).map((module: unknown) => {
        if (typeof module === 'string') return module
        if (typeof module === 'object' && module && 'default' in module) {
          return (module as any).default
        }
        return ''
      }).filter(Boolean) as string[];

      // Перемешиваем для случайного порядка
      return images.sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error("Error loading gallery:", error);
      return [];
    }
  };

  /**
   * Определяет тип устройства на основе ширины экрана
   * @returns true если мобильное устройство (< 768px)
   */
  const isMobileDevice = () => {
    if (import.meta.client) {
      return window.innerWidth < 768;
    }
    return false;
  };

  /**
   * Возвращает количество фотографий для загрузки на основе типа устройства
   * Мобильные: 10 фото, Desktop: 20 фото
   */
  const getLoadCount = () => {
    return isMobileDevice() ? 10 : 20;
  };

  /**
   * Загрузка фотографий с пагинацией из локальных файлов
   * @param offset - смещение для пагинации
   * @param count - количество фото для загрузки (необязательно, по умолчанию зависит от устройства)
   */
  const loadPhotosFromAPI = async (
    offset: number = 0,
    count?: number
  ): Promise<VKPhotosResponse> => {
    try {
      const loadCount = count || getLoadCount();

      // Загружаем все локальные фото
      const allPhotos = loadGalleryImages();

      // Эмулируем пагинацию на локальных данных
      const photos = allPhotos.slice(offset, offset + loadCount);
      const hasMore = offset + loadCount < allPhotos.length;

      return {
        photos,
        hasMore,
        total: allPhotos.length,
        source: 'local',
      };
    } catch (error) {
      console.error('Error loading photos from local:', error);

      // Возвращаем пустой ответ в случае ошибки
      return {
        photos: [],
        hasMore: false,
        total: 0,
        source: 'local',
      };
    }
  };

  /**
   * Композируемая функция для управления состоянием галереи с пагинацией
   */
  const useGalleryPagination = () => {
    const photos = ref<string[]>([]);
    const offset = ref(0);
    const hasMore = ref(true);
    const loading = ref(false);
    const total = ref(0);
    const source = ref<'vk' | 'local'>('local');

    /**
     * Инициализация галереи - загружает первую порцию фото
     */
    const initialize = async () => {
      loading.value = true;
      try {
        const response = await loadPhotosFromAPI(0);
        photos.value = response.photos;
        hasMore.value = response.hasMore;
        total.value = response.total;
        source.value = response.source;
        offset.value = response.photos.length;
      } catch (error) {
        console.error('Error initializing gallery:', error);
      } finally {
        loading.value = false;
      }
    };

    /**
     * Загрузка следующей порции фотографий
     */
    const loadMore = async () => {
      if (!hasMore.value || loading.value) return;

      loading.value = true;
      try {
        const response = await loadPhotosFromAPI(offset.value);
        photos.value = [...photos.value, ...response.photos];
        hasMore.value = response.hasMore;
        offset.value += response.photos.length;
      } catch (error) {
        console.error('Error loading more photos:', error);
      } finally {
        loading.value = false;
      }
    };

    return {
      photos,
      offset,
      hasMore,
      loading,
      total,
      source,
      initialize,
      loadMore,
    };
  };

  return {
    loadGalleryImages,
    loadPhotosFromAPI,
    isMobileDevice,
    getLoadCount,
    useGalleryPagination,
  };
};
