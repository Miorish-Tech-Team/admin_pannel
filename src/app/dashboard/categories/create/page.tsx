"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, useToast } from "@/components/atoms";
import { categoryApi } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";
import { ImageUpload } from "@/components/atoms/ImageUpload";

export default function CreateCategoryPage() {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryDescription: "",
  });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select an image file",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setCategoryImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }
    if (!formData.categoryDescription.trim()) {
      newErrors.categoryDescription = "Category description is required";
    }
    if (!categoryImage) {
      newErrors.image = "Category image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await categoryApi.createCategory({
        categoryName: formData.categoryName,
        categoryDescription: formData.categoryDescription,
        categoryImage: categoryImage!,
      });
      toast.success(response.message || "Category created successfully!");
      router.push("/dashboard/categories");
    } catch (error: any) {
      console.error("Create category error:", error);
      const errorMessage = error.response?.data?.message || "Failed to create category";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold font-cinzel"
          style={{ color: colors.primeGreen }}
        >
          Create Category
        </h1>
        <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
          Add a new product category
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg w-full shadow-md p-6 ">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Category Name"
            name="categoryName"
            placeholder="e.g., Candles"
            value={formData.categoryName}
            onChange={handleChange}
            error={errors.categoryName}
            disabled={isLoading}
          />

          <Textarea
            label="Category Description"
            name="categoryDescription"
            placeholder="Enter category description"
            value={formData.categoryDescription}
            onChange={handleChange}
            error={errors.categoryDescription}
            disabled={isLoading}
            rows={4}
          />

          {/* Image Upload */}
          <ImageUpload
            label="Category Image"
            required
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            error={errors.image}
            isLoading={isLoading}
          />

          {apiError && (
            <div
              className="p-3 rounded-lg text-sm font-poppins"
              style={{
                backgroundColor: `${colors.primeRed}20`,
                color: colors.primeRed,
              }}
            >
              {apiError}
            </div>
          )}

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="md"
              isLoading={isLoading}
            >
              Create Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
