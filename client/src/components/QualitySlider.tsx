/**
 * @file: QualitySlider.tsx
 * @description: Слайдер качества изображения
 * @dependencies: React
 * @created: 2024-06-06
 */

interface QualitySliderProps {
  value: number
  onChange: (value: number) => void
}

export function QualitySlider({ value, onChange }: QualitySliderProps) {
  return (
    <div>
      <label>Качество: {value}</label>
      <input
        type="range"
        min={10}
        max={100}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
} 