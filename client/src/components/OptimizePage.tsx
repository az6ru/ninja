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
import { Header } from './Header'

export function OptimizePage(props: OptimizePageConfig) {
  return (
    <>
      <Header />
      <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{props.h1}</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{props.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
            {props.bullets.map((b, i) => (
              <div key={i} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>{b}</span>
              </div>
            ))}
          </div>
          {/* <p className="text-base text-blue-200 mb-2">{props.description}</p> */}
        </div>
      </section>
      <ImageOptimizerApp />
      <Footer />
    </>
  )
} 