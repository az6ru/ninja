/**
 * @file: HeroSection.tsx
 * @description: Hero-секция для страницы оптимизации изображений
 * @dependencies: lucide-react, react, framer-motion
 * @created: 2024-06-04
 */
import { CheckCircle } from "lucide-react";
import { motion } from 'framer-motion';
import type { OptimizePageConfig } from '../config/pages.config';

type HeroSectionProps = Pick<OptimizePageConfig, 'h1' | 'subtitle' | 'bullets'>;

export function HeroSection({ h1, subtitle, bullets }: HeroSectionProps) {
  return (
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
          {h1}
        </motion.h1>
        <motion.h2 
          className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {subtitle}
        </motion.h2>
        <motion.div 
          className="flex flex-wrap justify-center gap-4 text-sm mb-8"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {bullets.map((bullet, i) => (
            <motion.div 
              key={i} 
              className="flex items-center space-x-2"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.05, duration: 0.2 }}
            >
            <CheckCircle className="w-4 h-4 text-green-300" />
              <h3 className="text-sm font-normal">{bullet}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
} 