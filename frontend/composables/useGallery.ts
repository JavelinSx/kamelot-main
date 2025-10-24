// composables/useGallery.ts
export const useGallery = () => {
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

  return {
    loadGalleryImages,
  };
};
