/**
 * @file: Footer.tsx
 * @description: Компактный футер: сетка SEO-ссылок и описание, всё выровнено по левому краю, на мобильных — один столбец
 * @dependencies: React, wouter
 * @created: 2024-06-05
 */
import { Link } from 'wouter'

const serviceLinks = [
  { href: '/', label: 'Сжать фото онлайн' },
  { href: '/bulk-image-compression', label: 'Пакетное сжатие' },
  { href: '/compress-without-quality-loss', label: 'Без потери качества' },
  { href: '/compress-with-exif', label: 'Сохранить EXIF' },
  { href: '/compare-image-quality', label: 'Сравнение качества' },
  { href: '/api', label: 'API для сжатия' },
  { href: '/faq', label: 'FAQ по сжатию' },
]

const formatLinks = [
  { href: '/compress-jpeg-online', label: 'Сжать JPEG' },
  { href: '/compress-png-online', label: 'Сжать PNG' },
  { href: '/compress-webp-online', label: 'Сжать WebP' },
  { href: '/compress-avif-online', label: 'Сжать AVIF' },
]

const convertLinks = [
  { href: '/convert-to-webp', label: 'Конвертировать в WebP' },
  { href: '/convert-avif-to-jpeg', label: 'Конвертировать AVIF → JPEG' },
  { href: '/convert-webp-to-png', label: 'Конвертировать WebP → PNG' },
  { href: '/convert-png-to-webp', label: 'Конвертировать PNG → WebP' },
  { href: '/convert-jpeg-to-webp', label: 'Конвертировать JPEG → WebP' },
]

const blogLinks = [
  { href: '/blog/kak-szhat-foto', label: 'Как сжать фото — гайд' },
  { href: '/blog/umenshit-foto-dlya-sayta', label: 'Уменьшить фото для сайта' },
]

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white pt-10 pb-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* Сетка ссылок */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div>
            <h4 className="text-blue-200 font-semibold mb-3 uppercase text-xs tracking-wider">Сервисные</h4>
            <ul className="space-y-2">
              {serviceLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white text-blue-300 underline text-sm transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-blue-200 font-semibold mb-3 uppercase text-xs tracking-wider">Форматы</h4>
            <ul className="space-y-2">
              {formatLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white text-blue-300 underline text-sm transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-blue-200 font-semibold mb-3 uppercase text-xs tracking-wider">Конвертация</h4>
            <ul className="space-y-2">
              {convertLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white text-blue-300 underline text-sm transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-blue-200 font-semibold mb-3 uppercase text-xs tracking-wider">Блог</h4>
            <ul className="space-y-2">
              {blogLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white text-blue-300 underline text-sm transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Разделитель */}
        <div className="w-full border-t border-slate-700 mb-6" />
        {/* Описание и копирайт */}
        <div className="flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥷</span>
            <span className="text-xl font-bold">imageninja.ru</span>
          </div>
          <p className="text-slate-300 max-w-xl text-sm">
            Быстрая и бесплатная оптимизация изображений для веба и социальных сетей. Сохраняйте качество, экономьте трафик и ускоряйте загрузку сайтов!
          </p>
          <p className="text-slate-400 text-xs mt-2">&copy; {new Date().getFullYear()} imageninja.ru — Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
} 