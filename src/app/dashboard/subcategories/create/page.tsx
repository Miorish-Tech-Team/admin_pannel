"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, Textarea, useToast } from "@/components/atoms";
import { categoryApi, subcategoryApi } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";
import { ImageUpload } from "@/components/atoms/ImageUpload";

export default function CreateSubcategoryPage() {
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<
    { id: number; categoryName: string }[]
  >([]);
  const [formData, setFormData] = useState({
    subCategoryName: "",
    subCategoryDescription: "",
    categoryId: "",
  });
  const [subCategoryImage, setSubCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsFetchingCategories(true);
      const response = await categoryApi.getAllCategories();
      setCategories(response.categories);
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      setSubCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setSubCategoryImage(null);
    setImagePreview(null);
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
    if (!subCategoryImage) {
      newErrors.image = "Subcategory image is required";
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
      const response = await subcategoryApi.createSubCategory({
        subCategoryName: formData.subCategoryName,
        subCategoryDescription: formData.subCategoryDescription,
        categoryId: Number(formData.categoryId),
        subCategoryImage: subCategoryImage!,
      });
      toast.success(response.message || "Subcategory created successfully!");
      router.push("/dashboard/subcategories");
    } catch (error: any) {
      console.error("Create subcategory error:", error);
      const errorMessage = error.response?.data?.message || "Failed to create subcategory";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold font-cinzel"
          style={{ color: colors.primeGreen }}
        >
          Create Subcategory
        </h1>
        <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
          Add a new product subcategory
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <Select
            label="Category"
            required
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={isLoading || isFetchingCategories}
            error={errors.categoryId}
            options={[
              { value: "", label: "Select a category" },
              ...categories.map((cat) => ({
                value: cat.id,
                label: cat.categoryName,
              })),
            ]}
          />

          <Input
            label="Subcategory Name"
            name="subCategoryName"
            placeholder="e.g., Puja Candles"
            value={formData.subCategoryName}
            onChange={handleChange}
            error={errors.subCategoryName}
            disabled={isLoading}
          />

          <Textarea
            label="Subcategory Description"
            name="subCategoryDescription"
            placeholder="Enter subcategory description"
            value={formData.subCategoryDescription}
            onChange={handleChange}
            error={errors.subCategoryDescription}
            disabled={isLoading}
            rows={4}
          />

          <ImageUpload
            label="Subcategory Image"
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
              Create Subcategory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
