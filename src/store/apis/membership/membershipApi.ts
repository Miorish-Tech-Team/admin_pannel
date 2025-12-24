import apiClient from "../apiClient";

export interface Membership {
  id: number;
  planName: "Basic" | "Standard" | "Premium";
  durationInDays: "30" | "90" | "180" | "365" | "730";
  price: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipFormData {
  planName: "Basic" | "Standard" | "Premium";
  durationInDays: "30" | "90" | "180" | "365" | "730";
  price: number;
  description: string;
  isActive?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  membership?: Membership;
  memberships?: Membership[];
}

export const membershipApi = {
  // Get all memberships
  getAllMemberships: async (): Promise<ApiResponse> => {
    const response = await apiClient.get("/admin/dashboard/memberships");
    return response.data;
  },

  // Get membership by ID
  getMembershipById: async (membershipId: number): Promise<ApiResponse> => {
    const response = await apiClient.get(`/admin/dashboard/memberships/${membershipId}`);
    return response.data;
  },

  // Create new membership
  createMembership: async (data: MembershipFormData): Promise<ApiResponse> => {
    const response = await apiClient.post("/admin/dashboard/memberships/create-membership", data);
    return response.data;
  },

  // Update membership
  updateMembership: async (membershipId: number, data: MembershipFormData): Promise<ApiResponse> => {
    const response = await apiClient.put(`/admin/dashboard/memberships/${membershipId}`, data);
    return response.data;
  },

  // Delete membership
  deleteMembership: async (membershipId: number): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/dashboard/memberships/${membershipId}/delete-membership`);
    return response.data;
  },

  // Delete seller membership
  deleteSellerMembership: async (sellerId: number): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/dashboard/memberships/${sellerId}/delete-membership`);
    return response.data;
  },
};
