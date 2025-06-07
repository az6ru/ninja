/**
 * @file: image-optimizer.tsx
 * @description: Главная страница сервиса оптимизации изображений (использует общий компонент и SEO-конфиг)
 * @dependencies: OptimizePage, Helmet, pages.config.ts
 * @created: 2024-06-05
 */

import pkg from 'react-helmet-async/lib/index.js';
const { Helmet } = pkg;
import { pages, getPages } from '@/config/pages.config'
import { OptimizePage } from '@/components/OptimizePage'
import { useEffect, useState } from 'react'
import type { OptimizePageConfig } from '@/config/pages.config'

export default function ImageOptimizer() {
  const [pagesData, setPagesData] = useState<OptimizePageConfig[]>(pages)
  const page = pagesData.find(p => p.slug === '')
  
  // Загружаем актуальные данные страниц
  useEffect(() => {
    getPages().then(updatedPages => {
      setPagesData(updatedPages)
    })
  }, [])
  
  if (!page) return null
  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
      </Helmet>
      <OptimizePage {...page} />
    </>
  )
}
