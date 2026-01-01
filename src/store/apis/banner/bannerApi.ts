import apiClient from "../apiClient";

// Banner Interfaces
export interface HomepageBanner {
  id: number;
  title: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyPromotionBanner {
  id: number;
  title: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThePopularBanner {
  id: number;
  title: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandPosterBanner {
  id: number;
  title: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPosterAdsBanner {
  id: number;
  title: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// Homepage Banner APIs
export const getHomepageBanners = async (): Promise<HomepageBanner[]> => {
  const response = await apiClient.get("/advertisement/homepage-banners");
  return response.data.banners || [];
};

export const addHomepageBanner = async (formData: FormData): Promise<HomepageBanner> => {
  const response = await apiClient.post(
    "/advertisement/add-homepage-banners",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteHomepageBanner = async (id: number): Promise<void> => {
  await apiClient.delete(`/advertisement/homepage-banners/${id}`);
};

// Weekly Promotion Banner APIs
export const getWeeklyPromotionBanners = async (): Promise<WeeklyPromotionBanner[]> => {
  const response = await apiClient.get("/advertisement/weekly-banners");
  return response.data.banners || [];
};

export const addWeeklyPromotionBanner = async (formData: FormData): Promise<WeeklyPromotionBanner> => {
  const response = await apiClient.post(
    "/advertisement/add-weekly-banners",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteWeeklyPromotionBanner = async (id: number): Promise<void> => {
  await apiClient.delete(`/advertisement/weekly-banners/${id}`);
};

// The Popular Banner APIs
export const getThePopularBanners = async (): Promise<ThePopularBanner[]> => {
  const response = await apiClient.get("/advertisement/popular-banners");
  return response.data.banners || [];
};

export const addThePopularBanner = async (formData: FormData): Promise<ThePopularBanner> => {
  const response = await apiClient.post(
    "/advertisement/add-popular-banners",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteThePopularBanner = async (id: number): Promise<void> => {
  await apiClient.delete(`/advertisement/popular-banners/${id}`);
};

// Brand Poster Banner APIs
export const getBrandPosterBanners = async (): Promise<BrandPosterBanner[]> => {
  const response = await apiClient.get("/advertisement/brands-banners");
  return response.data.banners || [];
};

export const addBrandPosterBanner = async (formData: FormData): Promise<BrandPosterBanner> => {
  const response = await apiClient.post(
    "/advertisement/add-brand-banners",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteBrandPosterBanner = async (id: number): Promise<void> => {
  await apiClient.delete(`/advertisement/brands-banners/${id}`);
};

// Product Poster Ads Banner APIs
export const getProductPosterAdsBanners = async (): Promise<ProductPosterAdsBanner[]> => {
  const response = await apiClient.get("/advertisement/products-banners");
  return response.data.banners || [];
};

export const addProductPosterAdsBanner = async (formData: FormData): Promise<ProductPosterAdsBanner> => {
  const response = await apiClient.post(
    "/advertisement/add-product-banners",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteProductPosterAdsBanner = async (id: number): Promise<void> => {
  await apiClient.delete(`/advertisement/products-banners/${id}`);
};

// Update Banner APIs
export const updateHomepageBanner = async (id: number, formData: FormData): Promise<HomepageBanner> => {
  const response = await apiClient.put(
    `/advertisement/homepage-banners/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateWeeklyPromotionBanner = async (id: number, formData: FormData): Promise<WeeklyPromotionBanner> => {
  const response = await apiClient.put(
    `/advertisement/weekly-banners/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateThePopularBanner = async (id: number, formData: FormData): Promise<ThePopularBanner> => {
  const response = await apiClient.put(
    `/advertisement/popular-banners/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateBrandPosterBanner = async (id: number, formData: FormData): Promise<BrandPosterBanner> => {
  const response = await apiClient.put(
    `/advertisement/brands-banners/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateProductPosterAdsBanner = async (id: number, formData: FormData): Promise<ProductPosterAdsBanner> => {
  const response = await apiClient.put(
    `/advertisement/products-banners/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
