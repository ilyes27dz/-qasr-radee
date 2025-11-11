// src/components/MultiColorSelector.tsx
'use client';

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

  const handleSelectColor = (color: string) => {
    if (color && !selectedColors.includes(color)) {
      const newColors = [...selectedColors, color];
      onChange(newColors);
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    const newColors = selectedColors.filter(color => color !== colorToRemove);
    onChange(newColors);
  };

  const availableColors = allColors.filter(color => !selectedColors.includes(color));

  return (
    <div className="space-y-3">
      {/* Selected Colors Display */}
      <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50 min-h-[60px]">
        {selectedColors.length === 0 ? (
          <p className="text-gray-500 text-sm">لم يتم اختيار أي ألوان بعد</p>
        ) : (
          selectedColors.map(color => (
            <div 
              key={color} 
              className="flex items-center gap-2 bg-white rounded-full px-3 py-2 text-sm border shadow-sm"
            >
              <div
                className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: colorMap[color] || '#CCCCCC' }}
                title={color}
              ></div>
              <span className="font-medium text-gray-700">{color}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveColor(color)} 
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          اختر الألوان المتاحة:
        </label>
        <select
          onChange={(e) => {
            handleSelectColor(e.target.value);
            e.target.value = ''; // Reset selection
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value=""
        >
          <option value="" disabled>-- اختر لونًا لإضافته --</option>
          {availableColors.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {selectedColors.length} / {allColors.length} ألوان مختارة
        </p>
      </div>

      {/* Quick Color Pills */}
      {availableColors.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">اختيار سريع:</p>
          <div className="flex flex-wrap gap-2">
            {availableColors.slice(0, 6).map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleSelectColor(color)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: colorMap[color] }}
                ></div>
                <span className="text-sm text-gray-700">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
