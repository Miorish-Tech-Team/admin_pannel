import apiClient from "../apiClient";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  isTwoFactorAuthEnable?: boolean;
  twoFactorMethod?: "email" | "authenticator";
  userId?: number;
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface Verify2FAPayload {
  verificationCode: string;
  userId?: number;
}

export interface LogoutResponse {
  message: string;
}

export const authApi = {
  signIn: async (payload: SignInPayload): Promise<SignInResponse> => {
    const response = await apiClient.post("/auth/signin", payload);
    return response.data;
  },

  verify2FA: async (payload: Verify2FAPayload): Promise<SignInResponse> => {
    const response = await apiClient.patch("/auth/verify-two-factor", payload);
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
