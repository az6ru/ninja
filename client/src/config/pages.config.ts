/**
 * @file: pages.config.ts
 * @description: Конфиг для генерации страниц оптимизации изображений
 * @dependencies: используется в динамических страницах оптимизации
 * @created: 2024-06-05
 */

export interface OptimizePageConfig {
  slug: string
  title: string
  description: string
  h1: string
  subtitle: string
  bullets: string[]
}

export const pages: OptimizePageConfig[] = [
  {
    slug: '',
    title: 'Сжать фото онлайн — быстро, бесплатно и без потерь — ImageNinja',
    description: 'Сжимайте изображения JPEG, PNG, WebP, AVIF без потери качества. Поддержка EXIF и пакетная обработка',
    h1: 'Сжимайте изображения без потери качества',
    subtitle: 'Быстрое и бесплатное сжатие изображений (JPEG, PNG, WebP, AVIF) без потерь качества. Просто перетащите файл, выберите параметры и скачайте результат!',
    bullets: ['Без регистрации', 'Пакетная обработка', 'Множество форматов']
  },
  {
    slug: 'compress-jpeg-online',
    title: 'Сжать JPEG онлайн — без потерь и за секунды — ImageNinja',
    description: 'Сжимаем JPEG без потерь качества, быстро, с сохранением EXIF',
    h1: 'Сжать JPEG изображение онлайн',
    subtitle: 'Быстрое сжатие JPEG без потери качества и с сохранением метаданных',
    bullets: ['Без потерь', 'Сохранение EXIF', 'Быстрая обработка']
  },
  {
    slug: 'compress-png-online',
    title: 'Сжать PNG онлайн — с прозрачностью и качеством — ImageNinja',
    description: 'Уменьшите PNG без потери прозрачности. Пакетная обработка',
    h1: 'Сжатие PNG без потерь',
    subtitle: 'Поддержка прозрачности, высокая точность, пакетный режим',
    bullets: ['Прозрачность сохраняется', 'Без потерь', 'Пакетная загрузка']
  },
  {
    slug: 'compress-webp-online',
    title: 'Сжать WebP онлайн — компактно и эффективно — ImageNinja',
    description: 'Онлайн-сжатие WebP с минимальными потерями. Поддержка API',
    h1: 'Сжатие WebP изображений онлайн',
    subtitle: 'Эффективное уменьшение WebP без потерь, поддержка API',
    bullets: ['WebP поддержка', 'Без потерь', 'API доступ']
  },
  {
    slug: 'compress-avif-online',
    title: 'Сжать AVIF онлайн — современный формат без потерь — ImageNinja',
    description: 'Эффективно сжимаем AVIF. Поддержка новых форматов, API',
    h1: 'Онлайн сжатие AVIF изображений',
    subtitle: 'Сжимаем AVIF с сохранением качества. Быстро и просто',
    bullets: ['Поддержка AVIF', 'Современные алгоритмы', 'API']
  },
  {
    slug: 'bulk-image-compression',
    title: 'Пакетное сжатие изображений онлайн — ImageNinja',
    description: 'Сжимайте сразу много изображений за один раз. Поддержка JPEG, PNG, WebP, AVIF.',
    h1: 'Пакетное сжатие изображений',
    subtitle: 'Загрузите несколько файлов и получите оптимизированные изображения одним архивом.',
    bullets: ['Пакетная обработка', 'Без потери качества', 'ZIP-архив на выходе']
  },
  {
    slug: 'compress-without-quality-loss',
    title: 'Сжать фото без потери качества — ImageNinja',
    description: 'Оптимизация изображений без видимых потерь. Сохраняем детали и метаданные.',
    h1: 'Сжатие без потери качества',
    subtitle: 'Максимальное сжатие без ухудшения визуального качества.',
    bullets: ['Без потерь', 'Сохранение EXIF', 'Высокое качество']
  },
  {
    slug: 'compress-with-exif',
    title: 'Сжать фото с сохранением EXIF — ImageNinja',
    description: 'Сохраняйте все метаданные при сжатии изображений.',
    h1: 'Сжатие с сохранением EXIF',
    subtitle: 'Ваши фото останутся с геометками и авторством.',
    bullets: ['Сохранение EXIF', 'Безопасно', 'Для профи и любителей']
  },
  {
    slug: 'compare-image-quality',
    title: 'Сравнение качества изображений после сжатия — ImageNinja',
    description: 'Сравните оригинал и оптимизированное изображение онлайн.',
    h1: 'Сравнение качества изображений',
    subtitle: 'Визуальное сравнение до и после оптимизации.',
    bullets: ['Сравнение до/после', 'Оценка качества', 'Прозрачность изменений']
  },
  {
    slug: 'convert-to-webp',
    title: 'Конвертировать в WebP онлайн — ImageNinja',
    description: 'Преобразуйте изображения JPEG, PNG, AVIF в WebP для ускорения сайта.',
    h1: 'Конвертация в WebP',
    subtitle: 'Быстрое и бесплатное преобразование в современный формат WebP.',
    bullets: ['WebP для сайта', 'Меньший размер', 'Высокое качество']
  },
  {
    slug: 'convert-avif-to-jpeg',
    title: 'Конвертировать AVIF в JPEG онлайн — ImageNinja',
    description: 'Преобразуйте AVIF в JPEG для совместимости с любыми устройствами.',
    h1: 'AVIF → JPEG онлайн',
    subtitle: 'Конвертация AVIF в JPEG без потери качества.',
    bullets: ['AVIF в JPEG', 'Совместимость', 'Без потерь']
  },
  {
    slug: 'convert-webp-to-png',
    title: 'Конвертировать WebP в PNG онлайн — ImageNinja',
    description: 'Преобразуйте WebP в PNG для работы с любыми редакторами.',
    h1: 'WebP → PNG онлайн',
    subtitle: 'Конвертация WebP в PNG без потери прозрачности.',
    bullets: ['WebP в PNG', 'Сохранение прозрачности', 'Высокое качество']
  },
  {
    slug: 'convert-png-to-webp',
    title: 'Конвертировать PNG в WebP онлайн — ImageNinja',
    description: 'Преобразуйте PNG в WebP для экономии места и ускорения загрузки.',
    h1: 'PNG → WebP онлайн',
    subtitle: 'Конвертация PNG в WebP с сохранением качества.',
    bullets: ['PNG в WebP', 'Меньший размер', 'Быстро и просто']
  },
  {
    slug: 'convert-jpeg-to-webp',
    title: 'Конвертировать JPEG в WebP онлайн — ImageNinja',
    description: 'Преобразуйте JPEG в WebP для современных сайтов и приложений.',
    h1: 'JPEG → WebP онлайн',
    subtitle: 'Конвертация JPEG в WebP с минимальными потерями.',
    bullets: ['JPEG в WebP', 'Современный формат', 'Высокая скорость']
  },
  // ...добавить остальные страницы по structure.md при необходимости
] 