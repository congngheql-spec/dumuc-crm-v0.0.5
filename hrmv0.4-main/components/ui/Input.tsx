import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  rightElement,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`
          flex items-center bg-white border rounded-md transition-all duration-200 overflow-hidden
          ${error ? 'border-red-300 ring-1 ring-red-100' : 'border-[#BCE3CD]'}
          focus-within:border-[#14A64A] focus-within:ring-1 focus-within:ring-[#14A64A] focus-within:shadow-sm
        `}
      >
        <input
          className={`
            w-full px-3 py-2 outline-none text-gray-800 placeholder-gray-400 bg-transparent
            ${className}
          `}
          {...props}
        />
        {rightElement && <div className="pr-3">{rightElement}</div>}
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-0.5">
          Vui lòng không để trống thông tin này để có thể Hoàn tất
        </span>
      )}
      {helperText && !error && (
        <span className="text-xs text-gray-500 mt-0.5 italic">{helperText}</span>
      )}
    </div>
  );
};
