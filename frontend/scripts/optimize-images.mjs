import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, parse, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '../public');
const FIGHT_CATEGORY_DIR = join(PUBLIC_DIR, 'images/fight-category');
const GALLERY_DIR = join(PUBLIC_DIR, 'images/gallery');

// Качество для разных форматов
const QUALITY = {
  webp: 85,
  avif: 75,
  jpeg: 85,
};

// Максимальные размеры для разных типов изображений
const MAX_SIZES = {
  'fight-category': {
    width: 800,  // Достаточно для карточек
    height: 600,
  },
  'gallery': {
    width: 1200,  // Для галереи, чтобы сохранить качество
    height: 1200,
  },
};

async function optimizeImage(imagePath, outputDir, maxSize) {
  const parsed = parse(imagePath);
  const baseName = parsed.name;

  console.log(`\nОптимизация: ${baseName}${parsed.ext}`);

  try {
    // Получаем информацию о изображении
    const metadata = await sharp(imagePath).metadata();
    console.log(`  Оригинал: ${metadata.width}x${metadata.height}, ${(metadata.size / 1024).toFixed(0)} KB`);

    // Базовая обработка с изменением размера
    let pipeline = sharp(imagePath);

    if (metadata.width > maxSize.width || metadata.height > maxSize.height) {
      pipeline = pipeline.resize(maxSize.width, maxSize.height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Конвертируем в WebP
    await pipeline
      .clone()
      .webp({ quality: QUALITY.webp })
      .toFile(join(outputDir, `${baseName}.webp`));

    const webpStats = await stat(join(outputDir, `${baseName}.webp`));
    console.log(`  ✓ WebP: ${(webpStats.size / 1024).toFixed(0)} KB (${((1 - webpStats.size / metadata.size) * 100).toFixed(0)}% экономия)`);

    // Конвертируем в AVIF (еще лучше сжатие)
    await pipeline
      .clone()
      .avif({ quality: QUALITY.avif })
      .toFile(join(outputDir, `${baseName}.avif`));

    const avifStats = await stat(join(outputDir, `${baseName}.avif`));
    console.log(`  ✓ AVIF: ${(avifStats.size / 1024).toFixed(0)} KB (${((1 - avifStats.size / metadata.size) * 100).toFixed(0)}% экономия)`);

    // Если это PNG, создаем оптимизированную версию PNG как fallback
    if (parsed.ext === '.png') {
      await pipeline
        .clone()
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(join(outputDir, `${baseName}-optimized.png`));

      const pngStats = await stat(join(outputDir, `${baseName}-optimized.png`));
      console.log(`  ✓ PNG (оптимизированный): ${(pngStats.size / 1024).toFixed(0)} KB (${((1 - pngStats.size / metadata.size) * 100).toFixed(0)}% экономия)`);
    }

  } catch (error) {
    console.error(`  ✗ Ошибка: ${error.message}`);
  }
}

async function processDirectory(dir, maxSize) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stats = await stat(filePath);

    if (stats.isFile() && /\.(png|jpg|jpeg)$/i.test(file)) {
      await optimizeImage(filePath, dir, maxSize);
    }
  }
}

async function main() {
  console.log('🖼️  Начинаем оптимизацию изображений...\n');

  // Оптимизируем fight-category изображения
  console.log('📁 Обрабатываем: images/fight-category/');
  await processDirectory(FIGHT_CATEGORY_DIR, MAX_SIZES['fight-category']);

  // Оптимизируем gallery изображения
  console.log('\n📁 Обрабатываем: images/gallery/');
  await processDirectory(GALLERY_DIR, MAX_SIZES['gallery']);

  console.log('\n✅ Оптимизация завершена!');
  console.log('\n📊 Следующие шаги:');
  console.log('  1. Обновите компоненты для использования <picture> с WebP/AVIF');
  console.log('  2. Пересоберите проект: npm run build:static');
  console.log('  3. Проверьте результаты в Lighthouse');
}

main().catch(console.error);
