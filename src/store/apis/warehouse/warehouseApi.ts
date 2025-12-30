import apiClient from "../apiClient";

export interface Warehouse {
  id: number;
  countryName: string;
  warehouseName: string;
  contactNumber: string | null;
  pinCode: string;
  state: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  city: string;
  addressLine: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehousePayload {
  countryName: string;
  warehouseName: string;
  contactNumber?: string;
  pinCode: string;
  state: string;
  district: string;
  latitude?: number;
  longitude?: number;
  city: string;
  addressLine: string;
  isPrimary?: boolean;
}

export interface UpdateWarehousePayload {
  countryName?: string;
  warehouseName?: string;
  contactNumber?: string;
  pinCode?: string;
  state?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  addressLine?: string;
  isPrimary?: boolean;
}

export const warehouseApi = {
  // Get all warehouses
  getAllWarehouses: async (): Promise<{ success: boolean; warehouses: Warehouse[] }> => {
    const response = await apiClient.get("/admin/dashboard/warehouse-add/all");
    return response.data;
  },

  // Get single warehouse by ID
  getWarehouseById: async (id: number): Promise<{ success: boolean; warehouse: Warehouse }> => {
    const response = await apiClient.get(`/admin/dashboard/warehouse-add/${id}`);
    return response.data;
  },

  // Create new warehouse
  createWarehouse: async (payload: CreateWarehousePayload): Promise<{ success: boolean; message: string; data: Warehouse }> => {
    const response = await apiClient.post("/admin/dashboard/warehouse-add/add", payload);
    return response.data;
  },

  // Update warehouse
  updateWarehouse: async (
    id: number,
    payload: UpdateWarehousePayload
  ): Promise<{ success: boolean; message: string; warehouse: Warehouse }> => {
    const response = await apiClient.put(`/admin/dashboard/warehouse-add/${id}`, payload);
    return response.data;
  },

  // Delete warehouse
  deleteWarehouse: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/dashboard/warehouse-add/${id}`);
    return response.data;
  },
};
