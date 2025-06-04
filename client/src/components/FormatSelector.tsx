/**
 * @file: FormatSelector.tsx
 * @description: Селектор формата изображения
 * @dependencies: React
 * @created: 2024-06-06
 */

interface FormatSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="border rounded p-2">
      <option value="jpeg">JPEG</option>
      <option value="png">PNG</option>
      <option value="webp">WebP</option>
    </select>
  );
} 