"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/atoms";
import { categoryApi, Category } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiEdit, FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { CategoryDetailSkeleton } from "@/components/skeletons/CategoryDetailSkeleton";

export default function ViewCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params.id);

  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch category");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        
        <CategoryDetailSkeleton />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            View Category
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="font-poppins" style={{ color: colors.primeRed }}>
            {error || "Category not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} style={{ color: colors.primeGreen }}>
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
              {category.categoryName}
            </h1>
            <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
              Category details
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push(`/dashboard/categories/${categoryId}/edit`)}
        >
          <FiEdit size={20} />
          Edit
        </Button>
      </div>

      {/* Category Details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative w-full h-96">
          <Image
            src={category.categoryImage}
            alt={category.categoryName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold font-poppins text-gray-500 mb-1">Description</h3>
            <p className="font-poppins" style={{ color: colors.darkgray }}>
              {category.categoryDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold font-poppins text-gray-500 mb-1">
                Total Products
              </h3>
              <p className="text-2xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
                {category.categoryProductCount}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold font-poppins text-gray-500 mb-1">
                Total Subcategories
              </h3>
              <p className="text-2xl font-bold font-cinzel" style={{ color: colors.primeGold }}>
                {category.subcategories?.length || 0}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold font-poppins text-gray-500 mb-1">Created At</h3>
            <p className="font-poppins" style={{ color: colors.darkgray }}>
              {new Date(category.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold font-cinzel mb-4" style={{ color: colors.primeGreen }}>
            Subcategories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.subcategories.map((sub) => (
              <div key={sub.id} className="border rounded-lg p-4">
                <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
                  <Image src={sub.subCategoryImage} alt={sub.subCategoryName} fill className="object-cover" unoptimized />
                </div>
                <h3 className="font-semibold font-poppins mb-1" style={{ color: colors.darkgray }}>
                  {sub.subCategoryName}
                </h3>
                <p className="text-sm font-poppins text-gray-600 line-clamp-2">
                  {sub.subCategoryDescription}
                </p>
                <p className="mt-2 text-xs font-poppins text-gray-500">
                  Products: {sub.subCategoryProductCount}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
