/**
 * @file: Header.tsx
 * @description: Современный адаптивный Header с логотипом и SEO-меню
 * @dependencies: React, wouter
 * @created: 2024-06-05
 */
import { useState } from 'react'
import { Link } from 'wouter'

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/compress-jpeg-online', label: 'JPEG' },
  { href: '/compress-png-online', label: 'PNG' },
  { href: '/compress-webp-online', label: 'WebP' },
  { href: '/compress-avif-online', label: 'AVIF' },
  { href: '/bulk-image-compression', label: 'Пакетное сжатие' },
  { href: '/blog/kak-szhat-foto', label: 'Блог' },
  { href: '/faq', label: 'FAQ' },
  { href: '/api', label: 'API' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="bg-slate-800 text-white sticky top-0 z-30 shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:text-blue-200">
          <span className="text-2xl">🥷</span>
          <span>imageninja.ru</span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-blue-200 hover:text-white px-2 py-1 rounded transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Mobile burger */}
        <button
          className="md:hidden flex items-center px-2 py-1"
          onClick={() => setOpen(v => !v)}
          aria-label="Открыть меню"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-slate-800 border-t border-slate-700 px-4 pb-4 flex flex-col gap-2 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-blue-200 hover:text-white px-2 py-2 rounded transition-colors text-base"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
} 