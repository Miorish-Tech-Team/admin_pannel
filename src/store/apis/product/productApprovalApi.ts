import apiClient from "../apiClient";

export interface PendingProduct {
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
  seller?: {
    id: number;
    sellerName: string;
    email: string;
    shopName: string;
  };
}

export interface PendingProductsResponse {
  pendingProducts: PendingProduct[];
}

export interface ApprovalResponse {
  message: string;
}

export const productApprovalApi = {
  // Get all pending products
  getPendingProducts: async (): Promise<PendingProductsResponse> => {
    const response = await apiClient.get("/admin/dashboard/pending-products");
    return response.data;
  },

  // Approve product
  approveProduct: async (productId: number): Promise<ApprovalResponse> => {
    const response = await apiClient.patch(`/admin/dashboard/pending-products/${productId}/approve`);
    return response.data;
  },

  // Reject product
  rejectProduct: async (productId: number): Promise<ApprovalResponse> => {
    const response = await apiClient.patch(`/admin/dashboard/pending-products/${productId}/reject`);
    return response.data;
  },
};
