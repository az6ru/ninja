/**
 * @file: [slug]/page.tsx
 * @description: Динамическая страница оптимизации изображений по slug
 * @dependencies: pages.config.ts, OptimizePage
 * @created: 2024-06-05
 */
import { notFound } from 'next/navigation'
import { pages, getPages } from '@/config/pages.config'
import { OptimizePage } from '@/components/OptimizePage'
import { useEffect, useState } from 'react'
import type { OptimizePageConfig } from '@/config/pages.config'

interface Props {
  params: { slug: string }
}

export default function Page({ params }: Props) {
  const slug = params.slug || ''
  const [pagesData, setPagesData] = useState<OptimizePageConfig[]>(pages)
  const page = pagesData.find(p => p.slug === slug)
  
  // Загружаем актуальные данные страниц
  useEffect(() => {
    getPages().then(updatedPages => {
      setPagesData(updatedPages)
    })
  }, [])
  
  if (!page) return notFound()
  return <OptimizePage {...page} />
} 