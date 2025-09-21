// composables/useVideoStreaming.ts

export interface VideoStreamingOptions {
  enableProgressiveDownload?: boolean;
  chunkSize?: number;
  maxConcurrentConnections?: number;
  adaptiveBitrate?: boolean;
  prefetchAmount?: number; // в секундах
}

export interface VideoQuality {
  width: number;
  height: number;
  bitrate: number;
  src: string;
  type: string;
  label: string;
}

export interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export const useVideoStreaming = (options: VideoStreamingOptions = {}) => {
  const {
    enableProgressiveDownload = true,
    chunkSize = 1024 * 1024, // 1MB chunks
    maxConcurrentConnections = 3,
    adaptiveBitrate = true,
    prefetchAmount = 10, // 10 секунд
  } = options;

  // Reactive state
  const isStreaming = ref(false);
  const downloadProgress = ref(0);
  const networkQuality = ref<NetworkInfo | null>(null);
  const currentQuality = ref<VideoQuality | null>(null);
  const availableQualities = ref<VideoQuality[]>([]);

  // Определение качества сети
  const detectNetworkQuality = (): NetworkInfo | null => {
    if (!process.client) return null;

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      return {
        effectiveType: connection.effectiveType || "4g",
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false,
      };
    }

    // Fallback определение через User Agent
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return {
        effectiveType: "3g",
        downlink: 5,
        rtt: 200,
        saveData: false,
      };
    }

    return {
      effectiveType: "4g",
      downlink: 10,
      rtt: 50,
      saveData: false,
    };
  };

  // Выбор оптимального качества видео
  const selectOptimalQuality = (
    qualities: VideoQuality[]
  ): VideoQuality | null => {
    if (!qualities.length) return null;

    const network = networkQuality.value;
    if (!network) return qualities[0];

    // Логика выбора качества на основе сети
    let targetBitrate: number;

    switch (network.effectiveType) {
      case "slow-2g":
      case "2g":
        targetBitrate = 200; // 200 kbps
        break;
      case "3g":
        targetBitrate = network.saveData ? 500 : 1000; // 500kbps - 1Mbps
        break;
      case "4g":
        targetBitrate = network.saveData ? 1500 : 3000; // 1.5-3Mbps
        break;
      default:
        targetBitrate = network.downlink > 5 ? 5000 : 2000; // 2-5Mbps
    }

    // Находим ближайшее подходящее качество
    return qualities.reduce((best, current) => {
      const bestDiff = Math.abs(best.bitrate - targetBitrate);
      const currentDiff = Math.abs(current.bitrate - targetBitrate);

      return currentDiff < bestDiff && current.bitrate <= targetBitrate * 1.2
        ? current
        : best;
    });
  };

  // Прогрессивная загрузка видео чанками
  const createProgressiveLoader = (url: string) => {
    return new Promise<Blob>((resolve, reject) => {
      if (!enableProgressiveDownload) {
        // Обычная загрузка
        fetch(url)
          .then((response) => response.blob())
          .then(resolve)
          .catch(reject);
        return;
      }

      let chunks: Uint8Array[] = [];
      let totalSize = 0;
      let downloadedSize = 0;

      const controller = new AbortController();

      fetch(url, {
        signal: controller.signal,
        headers: {
          Range: "bytes=0-", // Запрашиваем с поддержкой Range
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const contentLength = response.headers.get("Content-Length");
          if (contentLength) {
            totalSize = parseInt(contentLength);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("ReadableStream не поддерживается");
          }

          const readChunk = async (): Promise<void> => {
            try {
              const { done, value } = await reader.read();

              if (done) {
                // Объединяем все чанки
                const totalLength = chunks.reduce(
                  (sum, chunk) => sum + chunk.length,
                  0
                );
                const result = new Uint8Array(totalLength);
                let offset = 0;

                for (const chunk of chunks) {
                  result.set(chunk, offset);
                  offset += chunk.length;
                }

                const blob = new Blob([result], { type: "video/mp4" });
                resolve(blob);
                return;
              }

              if (value) {
                chunks.push(value);
                downloadedSize += value.length;

                // Обновляем прогресс
                if (totalSize > 0) {
                  downloadProgress.value = (downloadedSize / totalSize) * 100;
                }
              }

              // Продолжаем чтение
              await readChunk();
            } catch (error) {
              reject(error);
            }
          };

          readChunk();
        })
        .catch(reject);
    });
  };

  // Создание URL для blob видео
  const createVideoURL = (blob: Blob): string => {
    return URL.createObjectURL(blob);
  };

  // Предзагрузка части видео
  const prefetchVideoSegment = async (
    url: string,
    startTime: number = 0
  ): Promise<string | null> => {
    try {
      if (!enableProgressiveDownload) return url;

      console.log(`🎥 Предзагрузка сегмента с ${startTime}s`);

      // Примерный расчет байтов для N секунд (зависит от битрейта)
      const estimatedBytesPerSecond = currentQuality.value
        ? (currentQuality.value.bitrate * 1000) / 8 // kbps в bytes/sec
        : 500000; // 500KB/s по умолчанию

      const segmentSize = estimatedBytesPerSecond * prefetchAmount;
      const startByte = Math.floor(startTime * estimatedBytesPerSecond);
      const endByte = startByte + segmentSize;

      const response = await fetch(url, {
        headers: {
          Range: `bytes=${startByte}-${endByte}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        return createVideoURL(blob);
      }

      return null;
    } catch (error) {
      console.warn("🎥 Ошибка предзагрузки сегмента:", error);
      return null;
    }
  };

  // Адаптивная загрузка с изменением качества
  const adaptiveLoad = async (qualities: VideoQuality[]): Promise<string> => {
    availableQualities.value = qualities;
    networkQuality.value = detectNetworkQuality();

    const optimalQuality = selectOptimalQuality(qualities);
    if (!optimalQuality) {
      throw new Error("Не удалось выбрать качество видео");
    }

    currentQuality.value = optimalQuality;
    console.log(
      `🎥 Выбрано качество: ${optimalQuality.label} (${optimalQuality.bitrate}kbps)`
    );

    isStreaming.value = true;

    try {
      if (enableProgressiveDownload) {
        const blob = await createProgressiveLoader(optimalQuality.src);
        return createVideoURL(blob);
      } else {
        return optimalQuality.src;
      }
    } finally {
      isStreaming.value = false;
    }
  };

  // Мониторинг производительности и автоматическое переключение качества
  const monitorAndAdjustQuality = (videoElement: HTMLVideoElement) => {
    let lastSwitchTime = 0;
    const SWITCH_COOLDOWN = 10000; // 10 секунд между переключениями

    const checkBufferHealth = () => {
      if (!videoElement.buffered.length) return;

      const currentTime = videoElement.currentTime;
      const bufferedEnd = videoElement.buffered.end(
        videoElement.buffered.length - 1
      );
      const bufferAhead = bufferedEnd - currentTime;

      // Если буфер меньше 5 секунд - понижаем качество
      if (bufferAhead < 5 && Date.now() - lastSwitchTime > SWITCH_COOLDOWN) {
        const currentIndex = availableQualities.value.findIndex(
          (q) => q.src === currentQuality.value?.src
        );

        if (currentIndex > 0) {
          const lowerQuality = availableQualities.value[currentIndex - 1];
          console.log(`🎥 Понижение качества до: ${lowerQuality.label}`);
          switchQuality(lowerQuality, videoElement);
          lastSwitchTime = Date.now();
        }
      }

      // Если буфер больше 15 секунд - можно повысить качество
      if (bufferAhead > 15 && Date.now() - lastSwitchTime > SWITCH_COOLDOWN) {
        const currentIndex = availableQualities.value.findIndex(
          (q) => q.src === currentQuality.value?.src
        );

        if (currentIndex < availableQualities.value.length - 1) {
          const higherQuality = availableQualities.value[currentIndex + 1];
          console.log(`🎥 Повышение качества до: ${higherQuality.label}`);
          switchQuality(higherQuality, videoElement);
          lastSwitchTime = Date.now();
        }
      }
    };

    // Проверяем каждые 5 секунд
    const intervalId = setInterval(checkBufferHealth, 5000);

    // Очистка при размонтировании
    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return intervalId;
  };

  // Переключение качества на лету
  const switchQuality = async (
    quality: VideoQuality,
    videoElement: HTMLVideoElement
  ) => {
    const currentTime = videoElement.currentTime;
    const wasPlaying = !videoElement.paused;

    try {
      // Предзагружаем новое качество с текущей позиции
      const newUrl = await prefetchVideoSegment(quality.src, currentTime);

      if (newUrl) {
        videoElement.src = newUrl;
        videoElement.currentTime = currentTime;
        currentQuality.value = quality;

        if (wasPlaying) {
          await videoElement.play();
        }
      }
    } catch (error) {
      console.error("🎥 Ошибка переключения качества:", error);
    }
  };

  // Service Worker для кэширования
  const setupServiceWorkerCache = async () => {
    if (!("serviceWorker" in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register(
        "/sw-video-cache.js"
      );
      console.log("🎥 Service Worker для кэширования видео зарегистрирован");

      return registration;
    } catch (error) {
      console.warn("🎥 Не удалось зарегистрировать Service Worker:", error);
    }
  };

  // Cleanup функция для освобождения памяти
  const cleanup = () => {
    // Освобождаем blob URLs
    availableQualities.value.forEach((quality) => {
      if (quality.src.startsWith("blob:")) {
        URL.revokeObjectURL(quality.src);
      }
    });

    downloadProgress.value = 0;
    isStreaming.value = false;
    currentQuality.value = null;
    availableQualities.value = [];
  };

  // Автоматическая очистка при размонтировании
  onUnmounted(() => {
    cleanup();
  });

  return {
    // State
    isStreaming: readonly(isStreaming),
    downloadProgress: readonly(downloadProgress),
    networkQuality: readonly(networkQuality),
    currentQuality: readonly(currentQuality),
    availableQualities: readonly(availableQualities),

    // Methods
    adaptiveLoad,
    prefetchVideoSegment,
    switchQuality,
    monitorAndAdjustQuality,
    setupServiceWorkerCache,
    cleanup,

    // Utils
    detectNetworkQuality,
    selectOptimalQuality,
  };
};
