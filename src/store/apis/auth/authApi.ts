import apiClient from "../apiClient";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface LogoutResponse {
  message: string;
}

export const authApi = {
  signIn: async (payload: SignInPayload): Promise<SignInResponse> => {
    const response = await apiClient.post("/auth/signin", payload);
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const response = await apiClient.get("/auth/check");
      return response.data;
    } catch (error) {
      return null;
    }
  },
};
