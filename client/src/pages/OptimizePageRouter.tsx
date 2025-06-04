/**
 * @file: OptimizePageRouter.tsx
 * @description: Роутер для динамических SEO-страниц оптимизации изображений
 * @dependencies: wouter, react-helmet-async, pages.config.ts, OptimizePage, NotFound
 * @created: 2024-06-05
 */
import { Helmet } from 'react-helmet-async'
import { pages } from '@/config/pages.config'
import { OptimizePage } from '@/components/OptimizePage'
import NotFound from './not-found'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function OptimizePageRouter() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const slug = pathname === '/' ? '' : pathname.replace(/^\//, '')
  const page = pages.find(p => p.slug === slug)

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
    'description': page.meta.description,
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
    'image': baseUrl + '/screenshots/seo-cover.webp',
    'sameAs': [baseUrl]
  }

  return (
    <>
      <Helmet>
        <title>{page.meta.title}</title>
        <meta name="description" content={page.meta.description} />
        <link rel="canonical" href={pageUrl} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:site_name" content="ImageNinja" />
        <meta property="og:title" content={page.meta.title} />
        <meta property="og:description" content={page.meta.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={baseUrl + '/screenshots/seo-cover.webp'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.meta.title} />
        <meta name="twitter:description" content={page.meta.description} />
        <meta name="twitter:image" content={baseUrl + '/screenshots/seo-cover.webp'} />
        <meta name="theme-color" content="#312e81" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <OptimizePage {...page} />
        </motion.div>
      </AnimatePresence>
    </>
  )
} 