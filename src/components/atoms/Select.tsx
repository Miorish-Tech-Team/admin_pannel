import React from "react";
import { colors } from "@/utils/color";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string | number; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = "", style, ...props }, ref) => {
    const activeColor = error ? colors.primeRed : colors.primeGold;

    return (
      <div className="w-full">
        {label && (
          <label 
            className="block text-sm font-medium font-poppins mb-1.5" 
            style={{ color: colors.darkgray }}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-2 border rounded-lg font-poppins text-base transition-all duration-200 focus:outline-none focus:ring-1 appearance-none bg-white ${className}`}
            style={{
              borderColor: error ? colors.primeRed : "#D1D5DB",
              ["--tw-ring-color" as any]: activeColor,
              ...style
            }}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom Down Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="mt-1 text-sm font-poppins" style={{ color: colors.primeRed }}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm font-poppins text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";