import apiClient from "../apiClient";

// Types
export interface Product {
  id: number;
  productName: string;
  productDescription: string;
  productBrand: string;
  productPrice: number;
  productDiscountPercentage: number | null;
  productDiscountPrice: number | null;
  availableStockQuantity: number;
  status: "pending" | "approved" | "rejected";
  coverImageUrl: string;
  productCategoryId: number;
  productSubCategoryId: number;
  sellerId: number;
  productViewCount: number;
  totalSoldCount: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    categoryName: string;
  };
  subCategory?: {
    subCategoryName: string;
  };
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
}

export interface ProductByIdResponse {
  success: boolean;
  product: Product;
}

export interface ProductCountResponse {
  success: boolean;
  count: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

export interface ProductsByStatusResponse {
  success: boolean;
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  status: string;
}

// Admin Product API Functions (for seller products)
export const adminMyProductsApi = {
  getMyProducts: async (page = 1, limit = 10, search = ""): Promise<ProductsResponse> => {
    const response = await apiClient.get("/admin/dashboard/my-products", {
      params: { page, limit, search },
    });
    return response.data;
  },

  // Get product by ID
  getMyProductById: async (productId: number): Promise<ProductByIdResponse> => {
    const response = await apiClient.get(`/admin/dashboard/my-products/${productId}`);
    return response.data;
  },

  // Get products by status
  getMyProductsByStatus: async (
    status: string,
    page = 1,
    limit = 10
  ): Promise<ProductsByStatusResponse> => {
    const response = await apiClient.get(
      `/admin/dashboard/my-products/status/${status}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get product count
  getMyProductCount: async (): Promise<ProductCountResponse> => {
    const response = await apiClient.get("/admin/dashboard/my-products/count");
    return response.data;
  },
};
