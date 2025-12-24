import apiClient from "../apiClient";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  canReview?: boolean;
  authProvider: string;
  status: "active" | "suspended" | "deleted";
  isVerified: boolean;
  createdAt: string;
  orders?: Order[];
  reviews?: Review[];
  addresses?: Address[];
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Address {
  id: number;
  userId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UpdateUserStatusPayload {
  status: "active" | "suspended" | "deleted";
}

export const userManagementApi = {
  // Get all users with optional filters
  getAllUsers: async (filters?: {
    id?: number;
    email?: string;
    name?: string;
    status?: string;
  }): Promise<{ message: string; count: number; users: User[] }> => {
    const params = new URLSearchParams();
    if (filters?.id) params.append("id", filters.id.toString());
    if (filters?.email) params.append("email", filters.email);
    if (filters?.name) params.append("name", filters.name);
    if (filters?.status) params.append("status", filters.status);

    const response = await apiClient.get(
      `/admin/dashboard/users${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data;
  },

  // Get user details by ID
  getUserById: async (userId: number): Promise<{ message: string; user: User }> => {
    const response = await apiClient.get(`/admin/dashboard/users/${userId}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (
    userId: number,
    payload: UpdateUserStatusPayload
  ): Promise<{ message: string; user: User }> => {
    const response = await apiClient.patch(`/admin/dashboard/users/${userId}/status`, payload);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/dashboard/users/${userId}`);
    return response.data;
  },

  // Get user order by ID
  getUserOrderById: async (
    userId: number,
    orderId: number
  ): Promise<{ message: string; order: Order }> => {
    const response = await apiClient.get(`/admin/dashboard/users/${userId}/orders/${orderId}`);
    return response.data;
  },

  // Get user by order ID
  getUserByOrderId: async (orderId: number): Promise<{ message: string; user: User }> => {
    const response = await apiClient.get(`/admin/dashboard/users/order/${orderId}`);
    return response.data;
  },

  // Get user by phone
  getUserByPhone: async (phone: string): Promise<{ message: string; user: User }> => {
    const response = await apiClient.get(`/admin/dashboard/users/phone/${phone}`);
    return response.data;
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<{ message: string; user: User }> => {
    const response = await apiClient.get(`/admin/dashboard/users/email/${email}`);
    return response.data;
  },
};
