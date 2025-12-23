import React from "react";
import { colors } from "@/utils/color";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", style, ...props }, ref) => {
    // Determine the ring and border color based on error state
    // We use primeGold for normal focus as requested
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
        <textarea
          ref={ref}
          className={`w-full px-4 py-2 border rounded-lg font-poppins text-base transition-all duration-200 focus:outline-none focus:ring-1 min-h-[100px] resize-y ${className}`}
          style={{
            borderColor: error ? colors.primeRed : "#D1D5DB",
            ["--tw-ring-color" as any]: activeColor,
            ...style
          }}
          {...props}
        />
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

Textarea.displayName = "Textarea";