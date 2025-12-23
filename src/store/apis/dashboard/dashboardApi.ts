import apiClient from "../apiClient";

export interface DashboardStats {
  customers: number;
  sellers: number;
  products: number;
}

export const dashboardApi = {
  // Get all dashboard stats in one request
  getAllStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/admin/dashboard/stats");
    return response.data;
  },

  // Get individual counts
  getCustomersCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get("/admin/dashboard/customers-count");
    return response.data;
  },

  getSellersCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get("/admin/dashboard/sellers-count");
    return response.data;
  },

  getProductsCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get("/admin/dashboard/products-count");
    return response.data;
  },
};
