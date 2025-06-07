/**
 * @file: FaqPage.tsx
 * @description: Страница с часто задаваемыми вопросами о сервисе оптимизации изображений
 * @dependencies: react, Helmet
 * @created: 2024-06-07
 */
import pkg from 'react-helmet-async/lib/index.js';
const { Helmet } = pkg;
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { YandexAds } from '@/components/YandexAds';

export default function FaqPage() {
  const baseUrl = 'https://imageninja.ru';
  const pageUrl = baseUrl + '/faq';
  const title = 'Часто задаваемые вопросы об оптимизации изображений — ImageNinja';
  const description = 'Ответы на часто задаваемые вопросы о сервисе оптимизации изображений ImageNinja. Узнайте как сжимать изображения без потери качества, конвертировать форматы и многое другое.';
  
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="ImageNinja" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={baseUrl + '/assets/images/seo-cover.webp'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={baseUrl + '/assets/images/seo-cover.webp'} />
      </Helmet>
      
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 relative rounded-lg overflow-hidden shadow-lg">
          <img 
            src="/assets/images/seo-cover.webp" 
            alt="Оптимизация изображений с ImageNinja" 
            className="w-full h-64 object-cover"
            width="1200"
            height="630"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end">
            <h1 className="text-3xl font-bold text-white p-6">Часто задаваемые вопросы</h1>
          </div>
        </div>
        
        <div className="space-y-8">
          <FaqItem 
            question="Как работает сжатие изображений без потери качества?" 
            answer="Наш сервис использует современные алгоритмы сжатия, которые удаляют избыточные данные из изображений без влияния на их визуальное качество. Мы оптимизируем метаданные, цветовые профили и применяем интеллектуальное квантование цветов, чтобы уменьшить размер файла, сохраняя при этом высокое качество изображения." 
          />
          
          <FaqItem 
            question="Какие форматы изображений поддерживаются?" 
            answer="ImageNinja поддерживает все популярные форматы изображений: JPEG, PNG, WebP и AVIF. Вы можете загружать файлы в любом из этих форматов и конвертировать их между собой для максимальной оптимизации." 
          />
          
          <FaqItem 
            question="Сохраняются ли метаданные EXIF при сжатии?" 
            answer="Да, наш сервис позволяет сохранять метаданные EXIF при сжатии. Вы можете выбрать опцию 'Сохранить EXIF' перед оптимизацией, и все важные метаданные (геолокация, настройки камеры, авторские права) будут сохранены в оптимизированном файле." 
          />
          
          <div className="my-8">
            <YandexAds blockId="R-A-15762893-1" />
          </div>
          
          <FaqItem 
            question="Есть ли ограничения на размер загружаемых файлов?" 
            answer="Максимальный размер загружаемого изображения составляет 10 МБ. Для пакетной обработки вы можете загрузить до 20 файлов одновременно. Наш сервис полностью бесплатен и не требует регистрации." 
          />
          
          <FaqItem 
            question="Какой формат лучше всего подходит для веб-сайтов?" 
            answer="Для современных веб-сайтов мы рекомендуем использовать формат WebP, который обеспечивает отличное сжатие при сохранении высокого качества изображения. Формат поддерживается всеми современными браузерами. Для максимальной совместимости вы можете использовать JPEG в качестве запасного варианта для старых браузеров." 
          />
          
          <FaqItem 
            question="Безопасно ли загружать мои изображения на ваш сервис?" 
            answer="Да, безопасность ваших данных является нашим приоритетом. Все загружаемые изображения обрабатываются в памяти сервера и автоматически удаляются после завершения оптимизации. Мы не храним ваши изображения на наших серверах и не используем их для каких-либо целей, кроме предоставления услуги оптимизации." 
          />
          
          <FaqItem 
            question="Что такое 'сравнение качества' и как им пользоваться?" 
            answer="Функция 'сравнение качества' позволяет визуально сравнить оригинальное и оптимизированное изображение, чтобы убедиться, что качество не пострадало. Просто загрузите изображение, оптимизируйте его и нажмите на кнопку 'Сравнить' в результатах." 
          />
          
          <FaqItem 
            question="Как скачать все оптимизированные изображения сразу?" 
            answer="После оптимизации нескольких изображений вы увидите кнопку 'Скачать всё в ZIP'. Нажмите на неё, и все оптимизированные изображения будут упакованы в ZIP-архив и автоматически загружены на ваше устройство." 
          />
          
          <FaqItem 
            question="Теряются ли данные при конвертации между форматами?" 
            answer="При конвертации между форматами могут быть небольшие изменения в качестве, особенно при переходе от форматов без потерь (PNG) к форматам с потерями (JPEG). Однако наш сервис оптимизирован для сохранения максимального качества. Формат WebP обеспечивает хороший баланс между качеством и размером файла." 
          />
          
          <FaqItem 
            question="Можно ли использовать сервис на мобильных устройствах?" 
            answer="Да, наш сервис полностью адаптирован для работы на мобильных устройствах. Вы можете загружать, оптимизировать и скачивать изображения с любого смартфона или планшета с современным браузером." 
          />
        </div>
      </main>
      
      <Footer />
    </>
  );
}

interface FaqItemProps {
  question: string;
  answer: string;
}

function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="border-b border-slate-200 pb-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-3">{question}</h2>
      <p className="text-slate-600">{answer}</p>
    </div>
  );
} 