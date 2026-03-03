import React from 'react';


interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  highlighted?: boolean;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  highlighted = false,
}: SliderProps) {
  const highlightClasses = highlighted 
    ? 'px-3 py-1 rounded-full bg-clinical-50 ring-2 ring-clinical-200 text-clinical-800'
    : 'text-clinical-700';

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className={`text-[0.95rem] font-bold ${highlightClasses} transition-all duration-300`}>
          {label}
        </label>
        <span className="text-lg font-bold text-clinical-600 min-w-[80px] text-right">
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-clinical-300 focus:ring-offset-2 transition-all"
        style={{
          background: `linear-gradient(to right, #0284c7 0%, #0284c7 ${((value - min) / (max - min)) * 100}%, #e0f2fe ${((value - min) / (max - min)) * 100}%, #e0f2fe 100%)`,
        }}
      />
    </div>
  );
}
