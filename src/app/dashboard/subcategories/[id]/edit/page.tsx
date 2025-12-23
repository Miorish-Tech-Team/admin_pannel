"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Textarea } from "@/components/atoms";
import { FormSkeleton } from "@/components/skeletons";
import { categoryApi, subcategoryApi } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";

interface SubCategory {
  id: number;
  subCategoryName: string;
  subCategoryDescription: string;
  subCategoryImage: string;
  categoryId: number;
}

export default function EditSubcategoryPage() {
  const router = useRouter();
  const params = useParams();
  const subCategoryId = Number(params.id);

  const [categories, setCategories] = useState<{ id: number; categoryName: string }[]>([]);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const [formData, setFormData] = useState({
    subCategoryName: "",
    subCategoryDescription: "",
    categoryId: "",
  });
  const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    fetchData();
  }, [subCategoryId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch categories
      const categoriesResponse = await categoryApi.getAllCategories();
      setCategories(categoriesResponse.categories);

      // Find subcategory from all categories
      let foundSubcategory: SubCategory | null = null;
      for (const category of categoriesResponse.categories) {
        if (category.subcategories) {
          const sub = category.subcategories.find((s) => s.id === subCategoryId);
          if (sub) {
            foundSubcategory = sub as SubCategory;
            break;
          }
        }
      }

      if (foundSubcategory) {
        setSubcategory(foundSubcategory);
        setFormData({
          subCategoryName: foundSubcategory.subCategoryName,
          subCategoryDescription: foundSubcategory.subCategoryDescription,
          categoryId: foundSubcategory.categoryId.toString(),
        });
        setImagePreview(foundSubcategory.subCategoryImage);
      } else {
        setApiError("Subcategory not found");
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      setSubCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setSubCategoryImage(null);
    setImagePreview(subcategory?.subCategoryImage || null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.subCategoryName.trim()) {
      newErrors.subCategoryName = "Subcategory name is required";
    }
    if (!formData.subCategoryDescription.trim()) {
      newErrors.subCategoryDescription = "Subcategory description is required";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
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
        subCategoryName: formData.subCategoryName,
        subCategoryDescription: formData.subCategoryDescription,
        categoryId: Number(formData.categoryId),
      };
      if (subCategoryImage) {
        payload.subCategoryImage = subCategoryImage;
      }

      await subcategoryApi.updateSubCategory(subCategoryId, payload);
      router.push("/dashboard/subcategories");
    } catch (error: any) {
      console.error("Update subcategory error:", error);
      setApiError(error.response?.data?.message || "Failed to update subcategory");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            Edit Subcategory
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <FormSkeleton />
        </div>
      </div>
    );
  }

  if (!subcategory) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            Edit Subcategory
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center font-poppins" style={{ color: colors.primeRed }}>
            Subcategory not found
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
          Edit Subcategory
        </h1>
        <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
          Update subcategory information
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium font-poppins mb-1.5" style={{ color: colors.darkgray }}>
              Category <span style={{ color: colors.primeRed }}>*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg font-poppins text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.categoryId
                  ? `border-[${colors.primeRed}] focus:ring-[${colors.primeRed}]`
                  : `border-gray-300 focus:border-[${colors.primeGreen}] focus:ring-[${colors.primeGreen}]`
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm font-poppins" style={{ color: colors.primeRed }}>
                {errors.categoryId}
              </p>
            )}
          </div>

          <Input
            label="Subcategory Name"
            name="subCategoryName"
            placeholder="e.g., Puja Candles"
            value={formData.subCategoryName}
            onChange={handleChange}
            error={errors.subCategoryName}
            disabled={isSubmitting}
          />

          <Textarea
            label="Subcategory Description"
            name="subCategoryDescription"
            placeholder="Enter subcategory description"
            value={formData.subCategoryDescription}
            onChange={handleChange}
            error={errors.subCategoryDescription}
            disabled={isSubmitting}
            rows={4}
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium font-poppins mb-1.5" style={{ color: colors.darkgray }}>
              Subcategory Image
            </label>
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300">
                  <Image 
                    src={imagePreview} 
                    alt="Subcategory preview" 
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
                  {subCategoryImage && (
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
              Update Subcategory
            </Button>
            
          </div>
        </form>
      </div>
    </div>
  );
}
