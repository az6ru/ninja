/**
 * @file: SupportDonateModal.tsx
 * @description: Модальное окно поддержки проекта (донат через ЮMoney)
 * @dependencies: React, @radix-ui/react-dialog, TailwindCSS
 * @created: 2025-06-05
 */
import * as Dialog from '@radix-ui/react-dialog'
import { useRef } from 'react'
import { sendYandexMetrikaGoal, sendYandexMetrikaEvent } from '@/lib/yandex-metrika'

const QUICK_AMOUNTS = [50, 100, 200]

export function SupportDonateModal() {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleQuickAmount(val: number) {
    if (inputRef.current) inputRef.current.value = String(val)
    sendYandexMetrikaEvent('donate_quick_amount', { amount: val })
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-md px-4 py-2 text-sm transition-colors shadow-lg"
          onClick={() => sendYandexMetrikaEvent('donate_modal_open')}
        >
          Поддержать проект
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800 flex flex-col items-center">
          <Dialog.Title className="text-3xl mb-2">☕</Dialog.Title>
          <div className="text-xl font-bold text-white mb-1 text-center">Угостите разработчика кофе!</div>
          <div className="text-slate-400 text-sm mb-4 text-center">Ваша поддержка помогает сервису оставаться бесплатным и развиваться 🎁</div>
          <form
            action="https://yoomoney.ru/quickpay/confirm.xml"
            method="POST"
            target="_blank"
            className="w-full flex flex-col items-center gap-2"
            onSubmit={e => {
              const form = e.currentTarget
              const sumInput = form.elements.namedItem('sum') as HTMLInputElement | null
              const sum = sumInput?.value
              if (!sum || isNaN(Number(sum)) || Number(sum) < 10) {
                e.preventDefault()
                alert('Минимальная сумма — 10 ₽')
              } else {
                sendYandexMetrikaEvent('donate_form_submit', { amount: Number(sum) })
              }
            }}
          >
            <input type="hidden" name="receiver" value="41001811024650" />
            <input type="hidden" name="formcomment" value="Пожертвование на развитие imageninja.ru" />
            <input type="hidden" name="short-dest" value="Пожертвование на развитие imageninja.ru" />
            <input type="hidden" name="label" value="imageninja-donate" />
            <input type="hidden" name="quickpay-form" value="donate" />
            <input type="hidden" name="targets" value="Пожертвование" />
            <input type="hidden" name="successURL" value="https://imageninja.ru/donate-success" />
            <div className="flex gap-2 mb-2">
              {QUICK_AMOUNTS.map(val => (
                <button
                  type="button"
                  key={val}
                  className="bg-slate-800 hover:bg-slate-700 text-yellow-300 font-semibold rounded px-3 py-1 text-sm border border-yellow-400 transition-colors"
                  onClick={e => {
                    e.preventDefault()
                    handleQuickAmount(val)
                  }}
                >
                  {val} ₽
                </button>
              ))}
              <button
                type="button"
                className="bg-slate-800 text-slate-300 rounded px-3 py-1 text-sm border border-slate-600 cursor-default"
                disabled
              >
                Другая
              </button>
            </div>
            <input
              ref={inputRef}
              type="number"
              name="sum"
              min="10"
              step="1"
              required
              placeholder="Сумма, ₽"
              className="rounded-md px-3 py-2 text-sm text-slate-800 w-full border border-slate-300 focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-md px-4 py-2 text-sm transition-colors w-full mt-2"
            >
              Угостить кофе через ЮMoney
            </button>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl" aria-label="Закрыть">×</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 