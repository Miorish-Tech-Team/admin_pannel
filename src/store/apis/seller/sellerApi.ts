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

export interface Seller {
  id: number;
  sellerName: string;
  shopName: string;
  email: string;
  contactNumber: string;
  businessType: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessAddress: string;
  shopDescription: string;
  countryName: string;
  state: string;
  city: string;
  zipCode: string;
  shopLogo?: string;
  businessLicenseDocument?: string;
  taxDocument?: string;
  identityProof?: string;
  websiteURL?: string;
  isVerified: boolean;
  isApproved: boolean;
  status: "active" | "suspended" | "deactive";
  membershipId?: number;
  membershipStart?: string;
  membershipEnd?: string;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllSellersParams {
  status?: "active" | "suspended" | "deactive";
  isVerified?: boolean;
  isApproved?: boolean;
  businessType?: string;
  city?: string;
  state?: string;
  country?: string;
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

  // Get seller details by ID (pending)
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

  // Get all sellers with optional filters
  getAllSellers: async (params?: GetAllSellersParams): Promise<{ message: string; count: number; sellers: Seller[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.isVerified !== undefined) queryParams.append("isVerified", String(params.isVerified));
    if (params?.isApproved !== undefined) queryParams.append("isApproved", String(params.isApproved));
    if (params?.businessType) queryParams.append("businessType", params.businessType);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.state) queryParams.append("state", params.state);
    if (params?.country) queryParams.append("country", params.country);
    
    const response = await apiClient.get(`/admin/dashboard/sellers?${queryParams.toString()}`);
    return response.data;
  },

  // Get seller details by ID
  getSellerDetails: async (sellerId: number): Promise<{ message: string; seller: Seller }> => {
    const response = await apiClient.get(`/admin/dashboard/sellers/${sellerId}`);
    return response.data;
  },

  // Update seller status
  updateSellerStatus: async (sellerId: number, status: "active" | "suspended" | "deactive"): Promise<{ message: string; seller: Seller }> => {
    const response = await apiClient.patch(`/admin/dashboard/sellers/${sellerId}/status`, { status });
    return response.data;
  },

  // Delete seller
  deleteSeller: async (sellerId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/dashboard/sellers/${sellerId}`);
    return response.data;
  },

  // Get seller by contact number
  getSellerByContact: async (contact: string): Promise<{ message: string; seller: Seller }> => {
    const response = await apiClient.get(`/admin/dashboard/sellers/contact/${contact}`);
    return response.data;
  },

  // Get seller by membership ID
  getSellerByMembershipId: async (membershipId: number): Promise<{ message: string; seller: Seller }> => {
    const response = await apiClient.get(`/admin/dashboard/sellers/membership/${membershipId}`);
    return response.data;
  },

  // Get seller by email
  getSellerByEmail: async (email: string): Promise<{ message: string; seller: Seller }> => {
    const response = await apiClient.get(`/admin/dashboard/sellers/email/${email}`);
    return response.data;
  },
};
