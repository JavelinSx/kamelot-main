// composables/useGallery.ts
export const useGallery = () => {
  const loadGalleryImages = async () => {
    try {
      // Автоматический импорт всех изображений
      const modules = import.meta.glob(
        "/assets/images/gallery/*.{png,jpg,jpeg,webp}",
        {
          eager: true,
          as: "url",
        }
      );

      const images = Object.values(modules) as string[];

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
