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
    <div className="space-y-4">
      {/* Selected Colors */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          الألوان المختارة ({selectedColors.length})
        </label>
        
        {selectedColors.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">لم يتم اختيار أي ألوان بعد</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {selectedColors.map(color => (
              <div 
                key={color} 
                className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border shadow-sm transition-all hover:shadow-md"
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: colorMap[color] || '#CCCCCC' }}
                  title={color}
                />
                <span className="font-medium text-gray-800 text-sm">{color}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveColor(color)} 
                  className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color Selection */}
      <div className="border rounded-lg p-4 bg-white">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          إضافة ألوان جديدة
        </label>
        
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleSelectColor(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
        >
          <option value="">-- اختر لونًا لإضافته --</option>
          {availableColors.map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        {/* Quick Color Pills */}
        {availableColors.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">أو اختر من هنا:</p>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSelectColor(color)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: colorMap[color] }}
                  />
                  <span className="text-gray-700">{color}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
