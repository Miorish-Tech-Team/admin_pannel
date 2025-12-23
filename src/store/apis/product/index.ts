import apiClient from "../apiClient";

export interface Product {
  id: number;
  productName: string;
  productDescription: string;
  productBrand: string;
  productCode: string;
  productPrice: number;
  productDiscountPercentage?: number;
  productDiscountPrice?: number;
  availableStockQuantity: number;
  coverImageUrl: string;
  galleryImageUrls?: string[];
  productVideoUrl?: string;
  productCategoryId: number;
  productSubCategoryId: number;
  status: "pending" | "approved" | "rejected";
  productViewCount?: number;
  totalSoldCount?: number;
  productTags?: string | string[];
  productSizes?: string | string[];
  productColors?: string | string[];
  productWeight?: string;
  productDimensions?: string;
  productMaterial?: string;
  productWarrantyInfo?: string;
  productReturnPolicy?: string;
  stockKeepingUnit?: string;
  productModelNumber?: string;
  productBestSaleTag?: string;
  saleDayleft?: number;
  waxType?: string;
  singleOrCombo?: string;
  distributorPurchasePrice?: number;
  distributorSellingPrice?: number;
  retailerSellingPrice?: number;
  mrpB2B?: number;
  mrpB2C?: number;
  sellerId?: number;
  UserId?: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    categoryName: string;
  };
}

export interface ProductStats {
  totalStock: number;
  totalViews: number;
  totalSold: number;
}

export interface CreateProductPayload {
  productName: string;
  productDescription: string;
  productBrand: string;
  productCode: string;
  productPrice: number;
  productSubCategoryId: number;
  availableStockQuantity: number;
  coverImageUrl: File;
  galleryImageUrls?: File[];
  productVideoUrl?: string;
  productDiscountPercentage?: number;
  productDiscountPrice?: number;
  productTags?: string[];
  productSizes?: string[];
  productColors?: string[];
  productWeight?: string;
  productDimensions?: string;
  productMaterial?: string;
  productWarrantyInfo?: string;
  productReturnPolicy?: string;
  stockKeepingUnit?: string;
  productModelNumber?: string;
  productBestSaleTag?: string;
  saleDayleft?: number;
  waxType?: string;
  singleOrCombo?: string;
  distributorPurchasePrice?: number;
  distributorSellingPrice?: number;
  retailerSellingPrice?: number;
  mrpB2B?: number;
  mrpB2C?: number;
}

export interface UpdateProductPayload {
  productName?: string;
  productDescription?: string;
  productBrand?: string;
  productCode?: string;
  productPrice?: number;
  productSubCategoryId?: number;
  availableStockQuantity?: number;
  coverImageUrl?: File;
  galleryImageUrls?: File[];
  productVideoUrl?: string;
  productDiscountPercentage?: number;
  productDiscountPrice?: number;
  productTags?: string[];
  productSizes?: string[];
  productColors?: string[];
  productWeight?: string;
  productDimensions?: string;
  productMaterial?: string;
  productWarrantyInfo?: string;
  productReturnPolicy?: string;
  stockKeepingUnit?: string;
  productModelNumber?: string;
  productBestSaleTag?: string;
  saleDayleft?: number;
  waxType?: string;
  singleOrCombo?: string;
  distributorPurchasePrice?: number;
  distributorSellingPrice?: number;
  retailerSellingPrice?: number;
  mrpB2B?: number;
  mrpB2C?: number;
  status?: "pending" | "approved" | "rejected";
}

export const productApi = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get("/admin/dashboard/products");
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/admin/dashboard/products/${id}`);
    return response.data;
  },

  // Get product count
  getProductCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get("/admin/dashboard/products-count");
    return response.data;
  },

  // Get product stats
  getProductStats: async (): Promise<ProductStats> => {
    const response = await apiClient.get("/admin/dashboard/products-stats");
    return response.data;
  },

  // Get products by status
  getProductsByStatus: async (status: string): Promise<Product[]> => {
    const response = await apiClient.get(`/admin/dashboard/products/status/${status}`);
    return response.data;
  },

  // Create product
  createProduct: async (payload: CreateProductPayload): Promise<{ success: boolean; message: string; product: Product }> => {
    const formData = new FormData();
    
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "galleryImageUrls" && Array.isArray(value)) {
          value.forEach((file) => formData.append("galleryImageUrls", file));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.post("/admin/dashboard/add-products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update product
  updateProduct: async (id: number, payload: UpdateProductPayload): Promise<{ success: boolean; message: string; product: Product }> => {
    const formData = new FormData();
    
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "galleryImageUrls" && Array.isArray(value)) {
          value.forEach((file) => formData.append("galleryImageUrls", file));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.put(`/admin/dashboard/update-product/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/dashboard/delete-product/${id}`);
    return response.data;
  },

  // Bulk delete products
  bulkDeleteProducts: async (productIds: number[]): Promise<{ success: boolean; message: string; deletedCount: number }> => {
    const response = await apiClient.post("/admin/delete-products-bulk", { productIds });
    return response.data;
  },

  // Get products by category name
  getProductsByCategory: async (categoryName: string): Promise<{ success: boolean; products: Product[] }> => {
    const response = await apiClient.get(`/general/products/category/${categoryName}`);
    return response.data;
  },

  // Get products by subcategory name
  getProductsBySubCategory: async (subCategoryName: string): Promise<{ success: boolean; products: Product[] }> => {
    const response = await apiClient.get(`/general/products/subcategory/${subCategoryName}`);
    return response.data;
  },
};
