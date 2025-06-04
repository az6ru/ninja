/**
 * @file: [slug]/page.tsx
 * @description: Динамическая страница оптимизации изображений по slug
 * @dependencies: pages.config.ts, OptimizePage
 * @created: 2024-06-05
 */
import { notFound } from 'next/navigation'
import { pages } from '@/config/pages.config'
import { OptimizePage } from '@/components/OptimizePage'

interface Props {
  params: { slug: string }
}

export default function Page({ params }: Props) {
  const slug = params.slug || ''
  const page = pages.find(p => p.slug === slug)
  if (!page) return notFound()
  return <OptimizePage {...page} />
} 