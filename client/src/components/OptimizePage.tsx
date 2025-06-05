/**
 * @file: OptimizePage.tsx
 * @description: Универсальный компонент для SEO-страниц оптимизации изображений (Hero + приложение)
 * @dependencies: pages.config.ts, React, ImageOptimizerApp
 * @created: 2024-06-05
 */
import type { OptimizePageConfig } from '../config/pages.config'
import { ImageOptimizerApp } from './image-optimizer-app.tsx'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { YandexAds } from '@/components/YandexAds'
import { HeroSection } from './HeroSection'

export function OptimizePage(props: OptimizePageConfig) {
  return (
    <>
      <HeroSection h1={props.h1} subtitle={props.subtitle} bullets={props.bullets} />
      
      <motion.div
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <ImageOptimizerApp />
      </motion.div>
      
      {/* Рекламный блок после основного контента */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <YandexAds blockId="R-A-15762893-1" className="mb-8" />
      </div>
      
      <Footer />
    </>
  )
} 