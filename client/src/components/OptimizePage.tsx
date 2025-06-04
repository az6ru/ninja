/**
 * @file: OptimizePage.tsx
 * @description: Универсальный компонент для SEO-страниц оптимизации изображений (Hero + приложение)
 * @dependencies: pages.config.ts, React, ImageOptimizerApp
 * @created: 2024-06-05
 */
import type { OptimizePageConfig } from '../config/pages.config'
import { CheckCircle } from "lucide-react";
import { ImageOptimizerApp } from './image-optimizer-app.tsx'
import { Footer } from './Footer'
import { motion } from 'framer-motion'

export function OptimizePage(props: OptimizePageConfig) {
  return (
    <>
      <motion.section 
        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-16"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {props.h1}
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {props.subtitle}
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4 text-sm mb-8"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {props.bullets.map((b, i) => (
              <motion.div 
                key={i} 
                className="flex items-center space-x-2"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05, duration: 0.2 }}
              >
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>{b}</span>
              </motion.div>
            ))}
          </motion.div>
          {/* <p className="text-base text-blue-200 mb-2">{props.description}</p> */}
        </div>
      </motion.section>
      <motion.div
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <ImageOptimizerApp />
      </motion.div>
      <Footer />
    </>
  )
} 