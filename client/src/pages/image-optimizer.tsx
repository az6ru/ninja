/**
 * @file: image-optimizer.tsx
 * @description: Главная страница сервиса оптимизации изображений (использует общий компонент и SEO-конфиг)
 * @dependencies: OptimizePage, Helmet, pages.config.ts
 * @created: 2024-06-05
 */
import { Helmet } from 'react-helmet-async'
import { pages } from '@/config/pages.config'
import { OptimizePage } from '@/components/OptimizePage'

export default function ImageOptimizer() {
  const page = pages.find(p => p.slug === '')
  if (!page) return null
  return (
    <>
      <Helmet>
        <title>{page.meta.title}</title>
        <meta name="description" content={page.meta.description} />
      </Helmet>
      <OptimizePage {...page} />
    </>
  )
}
