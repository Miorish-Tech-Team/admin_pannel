"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Textarea } from "@/components/atoms";
import { categoryApi, Category } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";
import { EditCategorySkeleton } from "@/components/skeletons/EditCategorySkeleton";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params.id);

  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryDescription: "",
  });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const data = await categoryApi.getCategoryById(categoryId);
      setCategory(data);
      setFormData({
        categoryName: data.categoryName,
        categoryDescription: data.categoryDescription,
      });
      setImagePreview(data.categoryImage);
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Failed to fetch category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setCategoryImage(null);
    setImagePreview(category?.categoryImage || null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }
    if (!formData.categoryDescription.trim()) {
      newErrors.categoryDescription = "Category description is required";
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

    setIsSubmitting(true);

    try {
      const payload: any = {
        categoryName: formData.categoryName,
        categoryDescription: formData.categoryDescription,
      };
      if (categoryImage) {
        payload.categoryImage = categoryImage;
      }

      await categoryApi.updateCategory(categoryId, payload);
      router.push("/dashboard/categories");
    } catch (error: any) {
      console.error("Update category error:", error);
      setApiError(error.response?.data?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            Edit Category
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <EditCategorySkeleton />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            Edit Category
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center font-poppins" style={{ color: colors.primeRed }}>
            Category not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
          Edit Category
        </h1>
        <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
          Update category information
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Category Name"
            name="categoryName"
            placeholder="e.g., Candles"
            value={formData.categoryName}
            onChange={handleChange}
            error={errors.categoryName}
            disabled={isSubmitting}
          />

          <Textarea
            label="Category Description"
            name="categoryDescription"
            placeholder="Enter category description"
            value={formData.categoryDescription}
            onChange={handleChange}
            error={errors.categoryDescription}
            disabled={isSubmitting}
            rows={4}
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium font-poppins mb-1.5" style={{ color: colors.darkgray }}>
              Category Image
            </label>
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300">
                  <Image 
                    src={imagePreview} 
                    alt="Category preview" 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover" 
                    unoptimized
                  />
                </div>
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      className="w-full cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <FiUpload size={16} className="mr-2" />
                      Change Image
                    </Button>
                  </label>
                  {categoryImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                    >
                      <FiX size={16} className="mr-2" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <FiUpload size={40} style={{ color: colors.darkgray }} />
                <p className="mt-2 text-sm font-poppins" style={{ color: colors.darkgray }}>
                  Click to upload image
                </p>
                <p className="text-xs font-poppins text-gray-500">PNG, JPG up to 5MB</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </label>
            )}
            {errors.image && (
              <p className="mt-1 text-sm font-poppins" style={{ color: colors.primeRed }}>
                {errors.image}
              </p>
            )}
          </div>

          {apiError && (
            <div
              className="p-3 rounded-lg text-sm font-poppins"
              style={{ backgroundColor: `${colors.primeRed}20`, color: colors.primeRed }}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary" size="md" isLoading={isSubmitting}>
              Update Category
            </Button>
           
          </div>
        </form>
      </div>
    </div>
  );
}
