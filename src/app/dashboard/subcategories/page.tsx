"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import { ConfirmModal } from "@/components/modals";
import { TableSkeleton } from "@/components/skeletons";
import { categoryApi, subcategoryApi, SubCategoryWithCategory } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFileText } from "react-icons/fi";
import Image from "next/image";

export default function SubcategoriesPage() {
  const router = useRouter();
  const toast = useToast();
  const [subcategories, setSubcategories] = useState<SubCategoryWithCategory[]>([]);
  const [categories, setCategories] = useState<{ id: number; categoryName: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<SubCategoryWithCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Bulk delete states
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch subcategories and categories in parallel
      const [subCategoriesResponse, categoriesResponse] = await Promise.all([
        subcategoryApi.getAllSubCategories(),
        categoryApi.getAllCategories(),
      ]);
      
      setSubcategories(subCategoriesResponse.subCategories || []);
      setCategories(categoriesResponse.categories.map((cat) => ({
        id: cat.id,
        categoryName: cat.categoryName,
      })));
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (subcategory: SubCategoryWithCategory) => {
    setSubcategoryToDelete(subcategory);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subcategoryToDelete) return;

    setIsDeleting(true);
    try {
      await subcategoryApi.deleteSubCategory(subcategoryToDelete.id);
      toast.success(`Subcategory "${subcategoryToDelete.subCategoryName}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setSubcategoryToDelete(null);
      // Refresh data
      fetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete subcategory";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectSubcategory = (subcategoryId: number) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubcategories.length === filteredSubcategories.length) {
      setSelectedSubcategories([]);
    } else {
      setSelectedSubcategories(filteredSubcategories.map((sub) => sub.id));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedSubcategories.length === 0) {
      toast.warning("Please select subcategories to delete");
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await subcategoryApi.bulkDeleteSubCategories(selectedSubcategories);
      toast.success(`Successfully deleted ${selectedSubcategories.length} subcategory(ies)!`);
      setSelectedSubcategories([]);
      setIsBulkDeleteModalOpen(false);
      // Refresh data
      fetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete subcategories";
      toast.error(errorMessage);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sub) => sub.categoryId === selectedCategory)
    : subcategories;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            Subcategories
          </h1>
          <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
            Manage product subcategories
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedSubcategories.length > 0 && (
            <Button 
              variant="primary" 
              size="md" 
              onClick={handleBulkDeleteClick}
              style={{ backgroundColor: colors.primeRed }}
            >
              <FiTrash2 size={18} />
              Delete Selected ({selectedSubcategories.length})
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push("/dashboard/subcategories/create")}
          >
            <FiPlus size={20} />
            Add Subcategory
          </Button>
        </div>
      </div>

      {/* Filter by Category */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <label className="block text-sm font-medium font-poppins mb-2" style={{ color: colors.darkgray }}>
          Filter by Category
        </label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1 focus:ring-primeGold"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="p-4 rounded-lg font-poppins"
          style={{ backgroundColor: `${colors.primeRed}20`, color: colors.primeRed }}
        >
          {error}
        </div>
      )}

      {/* Subcategories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={6} />
          </div>
        ) : filteredSubcategories.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <p className="text-lg font-poppins text-gray-500">No subcategories found</p>
            <Button
              variant="secondary"
              size="md"
              className="mt-4"
              onClick={() => router.push("/dashboard/subcategories/create")}
            >
              Create First Subcategory
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.base }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.length === filteredSubcategories.length && filteredSubcategories.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: colors.primeGreen }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Products
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubcategories.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(sub.id)}
                        onChange={() => handleSelectSubcategory(sub.id)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: colors.primeGreen }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={sub.subCategoryImage}
                          alt={sub.subCategoryName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium font-poppins" style={{ color: colors.darkgray }}>
                        {sub.subCategoryName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-poppins"
                        style={{ backgroundColor: `${colors.primeGold}20`, color: colors.primeGold }}
                      >
                        {sub.category.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-poppins text-gray-600 line-clamp-2 max-w-xs">
                        {sub.subCategoryDescription}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-poppins"
                        style={{ backgroundColor: `${colors.primeGreen}20`, color: colors.primeGreen }}
                      >
                        {sub.subCategoryProductCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/subcategories/${sub.id}`)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} style={{ color: colors.primeGreen }} />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/subcategories/${sub.id}/edit`)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={18} style={{ color: colors.primeGold }} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(sub)}
                          disabled={isDeleting}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <FiTrash2 size={18} style={{ color: colors.primeRed }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Subcategory"
        message={`Are you sure you want to delete "${subcategoryToDelete?.subCategoryName}"? This action cannot be undone and may fail if there are products using this subcategory.`}
        confirmText="Delete Subcategory"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => !isBulkDeleting && setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Multiple Subcategories"
        message={`Are you sure you want to delete ${selectedSubcategories.length} selected subcategory(ies)? This action cannot be undone.`}
        confirmText={`Delete ${selectedSubcategories.length} Subcategory(ies)`}
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isBulkDeleting}
      />
    </div>
  );
}
