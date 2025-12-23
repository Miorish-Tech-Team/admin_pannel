import apiClient from "../apiClient";

export interface Category {
  id: number;
  categoryName: string;
  categoryProductCount: number;
  categoryDescription: string;
  categoryImage: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: number;
  subCategoryName: string;
  categoryId: number;
  subCategoryProductCount: number;
  subCategoryDescription: string;
  subCategoryImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  categoryName: string;
  categoryDescription: string;
  categoryImage: File;
}

export interface UpdateCategoryPayload {
  categoryName?: string;
  categoryDescription?: string;
  categoryImage?: File;
}

export const categoryApi = {
  // Get all categories with subcategories
  getAllCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await apiClient.get("/general/categories");
    return response.data;
  },

  // Get single category with subcategories
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/general/categories/${id}/sub-categories`);
    return response.data;
  },

  // Get all categories with product counts
  getCategoriesWithProductCount: async (): Promise<{ categories: Category[] }> => {
    const response = await apiClient.get("/general/categories-with-pro-count");
    return response.data;
  },

  // Create category
  createCategory: async (payload: CreateCategoryPayload): Promise<{ message: string; category: Category }> => {
    const formData = new FormData();
    formData.append("categoryName", payload.categoryName);
    formData.append("categoryDescription", payload.categoryDescription);
    formData.append("categoryImage", payload.categoryImage);

    const response = await apiClient.post("/admin/dashboard/categories/create-categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update category
  updateCategory: async (
    categoryId: number,
    payload: UpdateCategoryPayload
  ): Promise<{ message: string; category: Category }> => {
    const formData = new FormData();
    if (payload.categoryName) formData.append("categoryName", payload.categoryName);
    if (payload.categoryDescription) formData.append("categoryDescription", payload.categoryDescription);
    if (payload.categoryImage) formData.append("categoryImage", payload.categoryImage);

    const response = await apiClient.put(`/admin/dashboard/categories/${categoryId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete category
  deleteCategory: async (categoryId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/dashboard/categories/${categoryId}`);
    return response.data;
  },

  // Bulk delete categories
  bulkDeleteCategories: async (categoryIds: number[]): Promise<{ message: string; deletedCategories: number; deletedSubcategories: number }> => {
    const response = await apiClient.delete("/admin/dashboard/categories/bulk-delete", {
      data: { categoryIds },
    });
    return response.data;
  },
};
