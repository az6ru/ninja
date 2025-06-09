import { adsConfig } from '@/ads/ads-config'

interface AdSlotProps {
  slot: string
}

export function AdSlot({ slot }: AdSlotProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="bg-gray-200 text-gray-500 text-center py-6 rounded-lg border border-dashed border-gray-400 my-4">
        [Заглушка рекламы: {slot}]
      </div>
    )
  }
  const AdComponent = adsConfig[slot]
  if (!AdComponent) return null
  return <>{AdComponent()}</>
} 