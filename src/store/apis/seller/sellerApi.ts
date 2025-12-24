import apiClient from "../apiClient";

export interface PendingSeller {
  id: number;
  sellerName: string;
  shopName: string;
  email: string;
  contactNumber: string;
  businessType: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  businessAddress: string;
  shopDescription: string;
  countryName: string;
  state: string;
  city: string;
  zipCode: string;
  shopLogo: string;
  businessLicenseDocument: string;
  taxDocument: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const sellerApi = {
  // Get all pending sellers
  getPendingSellers: async (): Promise<ApiResponse<{ pendingSellers: PendingSeller[] }>> => {
    const response = await apiClient.get("/admin/dashboard/pending-seller");
    return { ...response.data, data: response.data };
  },

  // Get seller details by ID
  getSellerById: async (sellerId: number): Promise<ApiResponse<{ seller: PendingSeller }>> => {
    const response = await apiClient.get(`/admin/dashboard/pending-seller/${sellerId}`);
    return { ...response.data, data: response.data };
  },

  // Approve seller
  approveSeller: async (sellerId: number): Promise<ApiResponse> => {
    const response = await apiClient.patch(`/admin/dashboard/pending-seller/${sellerId}/approve`);
    return response.data;
  },

  // Reject seller
  rejectSeller: async (sellerId: number, rejectionReason: string): Promise<ApiResponse> => {
    const response = await apiClient.patch(`/admin/dashboard/pending-seller/${sellerId}/reject`, {
      rejectionReason,
    });
    return response.data;
  },
};
