import apiClient from "../apiClient";

// Blog Interface
export interface Blog {
  id: number;
  userId: number;
  title: string;
  description: string;
  image: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    email: string;
    fullName: string;
  };
}

export interface BlogsResponse {
  success: boolean;
  data: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BlogResponse {
  success: boolean;
  data: Blog;
  message?: string;
}

// Get all blogs with pagination
export const getAllBlogs = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<BlogsResponse> => {
  const response = await apiClient.get("/admin/dashboard/all", {
    params: { page, limit, search },
  });
  return response.data;
};

// Get blog by ID
export const getBlogById = async (id: number): Promise<BlogResponse> => {
  const response = await apiClient.get(`/admin/dashboard/${id}`);
  return response.data;
};

// Create blog
export const createBlog = async (formData: FormData): Promise<BlogResponse> => {
  const response = await apiClient.post("/admin/dashboard/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update blog
export const updateBlog = async (
  id: number,
  formData: FormData
): Promise<BlogResponse> => {
  const response = await apiClient.put(`/admin/dashboard/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete blog
export const deleteBlog = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/admin/dashboard/delete/${id}`);
  return response.data;
};
