import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  error?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`
          relative flex items-center bg-white border rounded-md transition-all duration-200
          ${error ? 'border-red-300 ring-1 ring-red-100' : 'border-[#BCE3CD]'}
          focus-within:border-[#14A64A] focus-within:ring-1 focus-within:ring-[#14A64A]
        `}
      >
        <select
          className={`
            w-full px-3 py-2 outline-none text-gray-800 bg-transparent appearance-none cursor-pointer z-10
            ${className}
          `}
          defaultValue=""
          {...props}
        >
          <option value="" disabled>
            -- Chọn --
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-0.5">
          Vui lòng chọn thông tin
        </span>
      )}
    </div>
  );
};
