"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import { ConfirmModal } from "@/components/modals";
import { TableSkeleton } from "@/components/skeletons";
import { categoryApi, Category } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Image from "next/image";

export default function CategoriesPage() {
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Bulk delete states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryApi.getAllCategories();
      setCategories(response.categories);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await categoryApi.deleteCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
      toast.success(`Category "${categoryToDelete.categoryName}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((cat) => cat.id));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedCategories.length === 0) {
      toast.warning("Please select categories to delete");
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const response = await categoryApi.bulkDeleteCategories(selectedCategories);
      setCategories((prev) => prev.filter((cat) => !selectedCategories.includes(cat.id)));
      toast.success(`Successfully deleted ${response.deletedCategories} category(ies) and ${response.deletedSubcategories} subcategory(ies)!`);
      setSelectedCategories([]);
      setIsBulkDeleteModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete categories";
      toast.error(errorMessage);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            Categories
          </h1>
          <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
            Manage product categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCategories.length > 0 && (
            <Button 
              variant="primary" 
              size="md" 
              onClick={handleBulkDeleteClick}
              style={{ backgroundColor: colors.primeRed }}
            >
              <FiTrash2 size={18} />
              Delete Selected ({selectedCategories.length})
            </Button>
          )}
          <Link href="/dashboard/categories/create">
            <Button variant="primary" size="md">
              <FiPlus size={20} />
              Add Category
            </Button>
          </Link>
        </div>
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

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={5} />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <p className="text-lg font-poppins text-gray-500">No categories found</p>
            <Link href="/dashboard/categories/create">
              <Button variant="secondary" size="md" className="mt-4">
                Create First Category
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.base }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === categories.length && categories.length > 0}
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Subcategories
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold font-poppins" style={{ color: colors.darkgray }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleSelectCategory(category.id)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: colors.primeGreen }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={category.categoryImage}
                          alt={category.categoryName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium font-poppins" style={{ color: colors.darkgray }}>
                        {category.categoryName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-poppins text-gray-600 line-clamp-2 max-w-xs">
                        {category.categoryDescription}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-poppins"
                        style={{ backgroundColor: `${colors.primeGreen}20`, color: colors.primeGreen }}
                      >
                        {category.categoryProductCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-poppins"
                        style={{ backgroundColor: `${colors.primeGold}20`, color: colors.primeGold }}
                      >
                        {category.subcategories?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/categories/${category.id}`)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Category"
                        >
                          <FiEye size={18} style={{ color: colors.primeGreen }} />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={18} style={{ color: colors.primeGold }} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
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
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.categoryName}"? This will also delete all associated subcategories. Products using this category must be reassigned first.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => !isBulkDeleting && setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Multiple Categories"
        message={`Are you sure you want to delete ${selectedCategories.length} selected category(ies)? This will also delete all associated subcategories. This action cannot be undone.`}
        confirmText={`Delete ${selectedCategories.length} Category(ies)`}
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isBulkDeleting}
      />
    </div>
  );
}
