import apiClient from "../apiClient";
import { SubCategory } from "../category/categoryApi";

export interface SubCategoryWithCategory extends SubCategory {
  category: {
    id: number;
    categoryName: string;
  };
}

export interface CreateSubCategoryPayload {
  subCategoryName: string;
  subCategoryDescription: string;
  categoryId: number;
  subCategoryImage: File;
}

export interface UpdateSubCategoryPayload {
  subCategoryName?: string;
  subCategoryDescription?: string;
  categoryId?: number;
  subCategoryImage?: File;
}

export const subcategoryApi = {
  // Get all subcategories
  getAllSubCategories: async (): Promise<{ success: boolean; subCategories: SubCategoryWithCategory[] }> => {
    const response = await apiClient.get("/general/subcategories");
    return response.data;
  },

  // Create subcategory
  createSubCategory: async (
    payload: CreateSubCategoryPayload
  ): Promise<{ success: boolean; message: string; subCategory: SubCategory }> => {
    const formData = new FormData();
    formData.append("subCategoryName", payload.subCategoryName);
    formData.append("subCategoryDescription", payload.subCategoryDescription);
    formData.append("categoryId", payload.categoryId.toString());
    formData.append("subCategoryImage", payload.subCategoryImage);

    const response = await apiClient.post("/admin/dashboard/subcategories/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update subcategory
  updateSubCategory: async (
    subCategoryId: number,
    payload: UpdateSubCategoryPayload
  ): Promise<{ success: boolean; message: string; subCategory: SubCategory }> => {
    const formData = new FormData();
    if (payload.subCategoryName) formData.append("subCategoryName", payload.subCategoryName);
    if (payload.subCategoryDescription) formData.append("subCategoryDescription", payload.subCategoryDescription);
    if (payload.categoryId) formData.append("categoryId", payload.categoryId.toString());
    if (payload.subCategoryImage) formData.append("subCategoryImage", payload.subCategoryImage);

    const response = await apiClient.put(`/admin/dashboard/subcategories/${subCategoryId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete subcategory
  deleteSubCategory: async (subCategoryId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/dashboard/subcategories/${subCategoryId}`);
    return response.data;
  },

  // Delete all subcategories by category
  deleteSubCategoriesByCategory: async (categoryId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/dashboard/subcategories/category/${categoryId}`);
    return response.data;
  },

  // Bulk delete subcategories
  bulkDeleteSubCategories: async (subcategoryIds: number[]): Promise<{ message: string }> => {
    const response = await apiClient.delete("/admin/dashboard/subcategories/bulk-delete", {
      data: { subcategoryIds },
    });
    return response.data;
  },
};
