const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types
export interface AdminProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  role: string;
  state?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  state?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  profilePhoto?: File;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface Toggle2FAPayload {
  enable: boolean;
  password: string;
  method?: "email" | "authenticator";
}

export interface TwoFactorAuthStatus {
  success: boolean;
  isTwoFactorAuthEnable: boolean;
  twoFactorMethod?: "email" | "authenticator";
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  user?: T;
  qrCode?: string;
  secret?: string;
  isTwoFactorAuthEnable?: boolean;
  twoFactorMethod?: "email" | "authenticator";
}

// Helper functions to call API without hooks
const baseUrl = `${API_URL}/user`;

export const adminProfileApi = {
  // Get Admin Profile
  getAdminProfile: async (): Promise<AdminProfile> => {
    const response = await fetch(`${baseUrl}/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw response;
    }

    const data: ApiResponse<AdminProfile> = await response.json();
    return data.user!;
  },

  // Update Admin Profile
  updateAdminProfile: async ({
    userId,
    data,
  }: {
    userId: number;
    data: FormData;
  }): Promise<ApiResponse> => {
    const response = await fetch(`${baseUrl}/edit/profile/${userId}`, {
      method: "PUT",
      credentials: "include",
      body: data,
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  },

  // Change Password
  changePassword: async (data: ChangePasswordPayload): Promise<ApiResponse> => {
    const response = await fetch(`${baseUrl}/edit/change-password`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  },

  // Get Two-Factor Auth Status
  getTwoFactorAuthStatus: async (): Promise<TwoFactorAuthStatus> => {
    const response = await fetch(`${baseUrl}/two-factor-status`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  },

  // Toggle Two-Factor Auth
  toggleTwoFactorAuth: async (data: Toggle2FAPayload): Promise<ApiResponse> => {
    const response = await fetch(`${baseUrl}/two-factor-auth`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  },
};
