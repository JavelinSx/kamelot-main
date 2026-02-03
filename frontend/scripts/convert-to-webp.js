import sharp from 'sharp'
import { readdir, stat, unlink } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Папки для конвертации
const folders = [
  join(__dirname, '../public/images'),
]

// Форматы для конвертации
const supportedFormats = ['.jpg', '.jpeg', '.png', '.avif']

async function convertToWebP(filePath) {
  const ext = extname(filePath).toLowerCase()

  if (!supportedFormats.includes(ext)) {
    return
  }

  const dir = dirname(filePath)
  const name = basename(filePath, ext)
  const webpPath = join(dir, `${name}.webp`)

  try {
    await sharp(filePath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath)

    // Удаляем исходный файл после успешной конвертации
    await unlink(filePath)

    console.log(`✓ Converted & deleted: ${basename(filePath)} → ${basename(webpPath)}`)
  } catch (error) {
    console.error(`✗ Error converting ${filePath}:`, error.message)
  }
}

async function processDirectory(dir) {
  try {
    const entries = await readdir(dir)

    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stats = await stat(fullPath)

      if (stats.isDirectory()) {
        await processDirectory(fullPath)
      } else if (stats.isFile()) {
        await convertToWebP(fullPath)
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message)
  }
}

async function main() {
  console.log('🔄 Converting images to WebP format...\n')

  for (const folder of folders) {
    console.log(`📁 Processing: ${folder}`)
    await processDirectory(folder)
    console.log('')
  }

  console.log('✅ Image conversion complete!')
}

main().catch(console.error)
