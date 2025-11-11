'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const colorMap: Record<string, string> = {
  'أبيض': '#FFFFFF',
  'أسود': '#000000',
  'أزرق': '#007BFF',
  'وردي': '#FFC0CB',
  'أحمر': '#DC3545',
  'أصفر': '#FFC107',
  'أخضر': '#28A745',
  'برتقالي': '#FD7E14',
  'بنفسجي': '#6F42C1',
  'رمادي': '#6C757D',
  'بيج': '#F5F5DC',
  'بني': '#A52A2A',
};

const allColors = Object.keys(colorMap);

interface MultiColorSelectorProps {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
}

export default function MultiColorSelector({ selectedColors, onChange }: MultiColorSelectorProps) {
  const [availableColors] = useState(allColors);

  const handleSelectColor = (color: string) => {
    if (color && !selectedColors.includes(color)) {
      onChange([...selectedColors, color]);
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    onChange(selectedColors.filter(color => color !== colorToRemove));
  };

  return (
    <div>
      <select
        onChange={(e) => handleSelectColor(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        defaultValue=""
      >
        <option value="" disabled>-- اختر لونًا لإضافته --</option>
        {availableColors.map(color => (
          <option key={color} value={color}>{color}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white min-h-[40px]">
        {selectedColors.map(color => (
          <div key={color} className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1 text-sm">
            <span
              className="w-4 h-4 rounded-full border border-gray-400"
              style={{ backgroundColor: colorMap[color] || '#CCCCCC' }}
            ></span>
            <span>{color}</span>
            <button type="button" onClick={() => handleRemoveColor(color)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

