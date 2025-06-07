/**
 * @file: OptimizePageRouter.tsx
 * @description: Роутер для динамических SEO-страниц оптимизации изображений
 * @dependencies: wouter, react-helmet-async, pages.config.ts, OptimizePage, NotFound
 * @created: 2024-06-05
 */
import pkg from 'react-helmet-async';
const { Helmet } = pkg;
import { pages, getPages } from '@/config/pages.config'
import { OptimizePage } from '@/components/OptimizePage'
import { Header } from '@/components/Header'
import NotFound from './not-found'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { OptimizePageConfig } from '@/config/pages.config'

export function OptimizePageRouter() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const slug = pathname === '/' ? '' : pathname.replace(/^\//, '')
  const [pagesData, setPagesData] = useState<OptimizePageConfig[]>(pages)
  const page = pagesData.find(p => p.slug === slug)
  
  // Загружаем актуальные данные страниц
  useEffect(() => {
    getPages().then(updatedPages => {
      setPagesData(updatedPages)
    })
  }, [])

  // Скролл вверх при переходе на новую страницу
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  if (!page) return <NotFound />

  const baseUrl = 'https://imageninja.ru'
  const pageUrl = baseUrl + (page.slug ? `/${page.slug}` : '/')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineTool',
    'name': page.title,
    'description': page.description,
    'url': pageUrl,
    'applicationCategory': 'PhotoEditingApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'RUB',
      'availability': 'https://schema.org/InStock'
    },
    'inLanguage': 'ru',
    'image': baseUrl + '/assets/images/seo-cover.webp',
    'sameAs': [baseUrl]
  }

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={pageUrl} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="ImageNinja" />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={baseUrl + '/assets/images/seo-cover.webp'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.description} />
        <meta name="twitter:image" content={baseUrl + '/assets/images/seo-cover.webp'} />
        <meta name="theme-color" content="#312e81" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      
      {/* Хедер вне анимации, чтобы он оставался неподвижным */}
      <Header />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <OptimizePage {...page} />
        </motion.div>
      </AnimatePresence>
    </>
  )
} 