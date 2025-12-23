import React from "react";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import { colors } from "@/utils/color";

interface ImageUploadProps {
  label?: string;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  error?: string;
  isLoading?: boolean;
  required?: boolean;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  imagePreview,
  onImageChange,
  onRemoveImage,
  error,
  isLoading = false,
  required = false,
  helperText = "PNG, JPG up to 5MB",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          className="block text-sm font-medium font-poppins mb-1.5"
          style={{ color: colors.darkgray }}
        >
          {label} {required && <span style={{ color: colors.primeRed }}>*</span>}
        </label>
      )}

      {imagePreview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300">
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            style={{ color: colors.primeRed }}
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <label
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200"
          style={{
            borderColor: error ? colors.primeRed : colors.darkgray,
            backgroundColor: "transparent",
          }}
          // Hover effect to mimic the Gold focus of your other inputs
          onMouseEnter={(e) => {
            if (!error) e.currentTarget.style.borderColor = colors.primeGold;
          }}
          onMouseLeave={(e) => {
            if (!error) e.currentTarget.style.borderColor = colors.darkgray;
          }}
        >
          <FiUpload size={40} style={{ color: colors.darkgray }} />
          <p className="mt-2 text-sm font-poppins" style={{ color: colors.darkgray }}>
            Click to upload image
          </p>
          <p className="text-xs font-poppins text-gray-500">{helperText}</p>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onImageChange}
            disabled={isLoading}
          />
        </label>
      )}

      {error && (
        <p className="mt-1 text-sm font-poppins" style={{ color: colors.primeRed }}>
          {error}
        </p>
      )}
    </div>
  );
};