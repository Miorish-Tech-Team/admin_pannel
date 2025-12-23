"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import { subcategoryApi, categoryApi, SubCategory } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiArrowLeft, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Image from "next/image";
import { ConfirmModal } from "@/components/modals";
import { SubcategoryDetailSkeleton } from "@/components/skeletons/SubcategoryDetailSkeleton";

interface SubCategoryDetails extends SubCategory {
  category?: {
    id: number;
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;
  };
}

export default function ViewSubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const subcategoryId = Number(params.id);

  const [subcategory, setSubcategory] = useState<SubCategoryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (subcategoryId) {
      fetchSubcategory();
    }
  }, [subcategoryId]);

  const fetchSubcategory = async () => {
    try {
      setIsLoading(true);
      // Fetch all categories to find the subcategory
      const categoriesResponse = await categoryApi.getAllCategories();
      
      let foundSubcategory: SubCategoryDetails | null = null;
      
      for (const category of categoriesResponse.categories) {
        if (category.subcategories) {
          const sub = category.subcategories.find((s) => s.id === subcategoryId);
          if (sub) {
            foundSubcategory = {
              ...sub,
              category: {
                id: category.id,
                categoryName: category.categoryName,
                categoryDescription: category.categoryDescription,
                categoryImage: category.categoryImage,
              },
            };
            break;
          }
        }
      }

      if (foundSubcategory) {
        setSubcategory(foundSubcategory);
      } else {
        setError("Subcategory not found");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch subcategory");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await subcategoryApi.deleteSubCategory(subcategoryId);
      toast.success("Subcategory deleted successfully!");
      router.push("/dashboard/subcategories");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete subcategory";
      toast.error(errorMessage);
      setIsDeleting(false);
    }
  };

 

  if (isLoading) {
    return (
      <SubcategoryDetailSkeleton />
    );
  }

  if (error || !subcategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/subcategories">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiArrowLeft size={24} style={{ color: colors.primeGreen }} />
            </button>
          </Link>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            View Subcategory
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-lg font-poppins" style={{ color: colors.primeRed }}>
            {error || "Subcategory not found"}
          </p>
          <Link href="/dashboard/subcategories">
            <Button variant="primary" size="md" className="mt-4">
              Back to Subcategories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/subcategories">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiArrowLeft size={24} style={{ color: colors.primeGreen }} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
              Subcategory Details
            </h1>
            <p className="mt-1 font-poppins text-gray-600">{subcategory.subCategoryName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/subcategories/${subcategoryId}/edit`}>
            <Button variant="secondary" size="md">
              <FiEdit size={18} />
              Edit
            </Button>
          </Link>
          <Button variant="primary" size="md" onClick={handleDeleteClick}>
            <FiTrash2 size={18} />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image */}
        <div className="lg:col-span-1 space-y-4">
          {/* Subcategory Image */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold font-poppins mb-3" style={{ color: colors.darkgray }}>
              Subcategory Image
            </h3>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={subcategory.subCategoryImage}
                alt={subcategory.subCategoryName}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold font-poppins mb-3" style={{ color: colors.darkgray }}>
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-poppins text-sm text-gray-600">Total Products</span>
                <span className="font-bold text-lg font-poppins" style={{ color: colors.primeGreen }}>
                  {subcategory.subCategoryProductCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
                {subcategory.subCategoryName}
              </h2>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold font-poppins text-gray-500 mb-1">Description</h3>
              <p className="font-poppins text-gray-700">{subcategory.subCategoryDescription}</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                
                <div>
                  <h3 className="text-sm font-semibold font-poppins text-gray-500 mb-1">Product Count</h3>
                  <p className="font-poppins text-gray-900">{subcategory.subCategoryProductCount || 0}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold font-poppins text-gray-500 mb-1">Created At</h3>
                  <p className="font-poppins text-gray-900">
                    {new Date(subcategory.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold font-poppins text-gray-500 mb-1">Last Updated</h3>
                  <p className="font-poppins text-gray-900">
                    {new Date(subcategory.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Category Info */}
          {subcategory.category && (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-xl font-semibold font-cinzel" style={{ color: colors.primeGreen }}>
                Parent Category
              </h3>
              
              <div className="flex items-start gap-4">
                {/* Category Image */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                  <Image
                    src={subcategory.category.categoryImage}
                    alt={subcategory.category.categoryName}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Category Details */}
                <div className="flex-1">
                  <h4 className="text-lg font-bold font-poppins" style={{ color: colors.darkgray }}>
                    {subcategory.category.categoryName}
                  </h4>
                  <p className="font-poppins text-sm text-gray-600 mt-1">
                    {subcategory.category.categoryDescription}
                  </p>
                  <Link href={`/dashboard/categories/${subcategory.category.id}`}>
                    <Button variant="outline" size="sm" className="mt-3">
                      View Category
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${subcategory.subCategoryName}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
