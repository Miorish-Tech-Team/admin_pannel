"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa";
import {
  getHomepageBanners,
  getWeeklyPromotionBanners,
  getThePopularBanners,
  getBrandPosterBanners,
  deleteHomepageBanner,
  deleteWeeklyPromotionBanner,
  deleteThePopularBanner,
  deleteBrandPosterBanner,
  type HomepageBanner,
  type WeeklyPromotionBanner,
  type ThePopularBanner,
  type BrandPosterBanner,
} from "@/store/apis/banner/bannerApi";
import { useToast, Button } from "@/components/atoms";
import { AddBannerModal, DeleteBannerModal } from "@/components/modals";

type BannerType = "homepage" | "weekly" | "popular" | "brand" ;

type Banner =
  | HomepageBanner
  | WeeklyPromotionBanner
  | ThePopularBanner
  | BrandPosterBanner;

const BANNER_LIMITS = {
  homepage: 3,
  weekly: 4,
  popular: 1,
  brand: 5,
};

const BannerManagement = () => {
  const [activeTab, setActiveTab] = useState<BannerType>("homepage");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { showToast } = useToast();

  const tabs = [
    { id: "homepage" as BannerType, label: "Homepage Banners" },
    { id: "weekly" as BannerType, label: "Weekly Promotion" },
    { id: "popular" as BannerType, label: "The Popular" },
    { id: "brand" as BannerType, label: "Brand Posters" },
  ];

  useEffect(() => {
    fetchBanners();
  }, [activeTab]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      let data: Banner[] = [];
      switch (activeTab) {
        case "homepage":
          data = await getHomepageBanners();
          break;
        case "weekly":
          data = await getWeeklyPromotionBanners();
          break;
        case "popular":
          data = await getThePopularBanners();
          break;
        case "brand":
          data = await getBrandPosterBanners();
          break;
      }
      setBanners(data);
    } catch (error: any) {
      console.log(error.response?.data?.message || "Failed to fetch banners", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      switch (activeTab) {
        case "homepage":
          await deleteHomepageBanner(id);
          break;
        case "weekly":
          await deleteWeeklyPromotionBanner(id);
          break;
        case "popular":
          await deleteThePopularBanner(id);
          break;
        case "brand":
          await deleteBrandPosterBanner(id);
          break;
      }
      showToast("Banner deleted successfully", "success");
      setShowDeleteModal(false);
      setSelectedBanner(null);
      fetchBanners();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to delete banner", "error");
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchBanners();
    showToast("Banner added successfully", "success");
  };

  const handleDeleteClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowDeleteModal(true);
  };

  const handleImageClick = (imageUrl: string) => {
    setImagePreview(imageUrl);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cinzel font-bold mb-2">
          Banner Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage website banners and advertisements
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
            disabled={banners.length >= BANNER_LIMITS[activeTab]}
          >
            <FaPlus />
            Add Banner
          </Button>
          {banners.length >= BANNER_LIMITS[activeTab] && (
            <span className="text-sm text-red-600 dark:text-red-400">
              Maximum {BANNER_LIMITS[activeTab]} banner{BANNER_LIMITS[activeTab] > 1 ? 's' : ''} reached
            </span>
          )}
          {banners.length > 0 && banners.length < BANNER_LIMITS[activeTab] && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {banners.length} / {BANNER_LIMITS[activeTab]} banners
            </span>
          )}
        </div>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 bg-gray-50 dark:bg-gray-100 rounded-lg">
          <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">  
            No banners found. Click "Add Banner" to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div
                className="relative aspect-video bg-gray-200 dark:bg-gray-700 cursor-pointer"
                onClick={() => handleImageClick(banner.image)}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold font-cinzel text-gray-800 mb-2 truncate">
                  {banner.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Created: {new Date(banner.createdAt).toLocaleDateString()}
                </p>
                <Button
                  onClick={() => handleDeleteClick(banner)}
                  variant="danger"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Banner Modal */}
      {showAddModal && (
        <AddBannerModal
          bannerType={activeTab}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBanner && (
        <DeleteBannerModal
          banner={selectedBanner}
          bannerType={activeTab}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBanner(null);
          }}
          onConfirm={() => handleDelete(selectedBanner.id)}
        />
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
          onClick={() => setImagePreview(null)}
        >
          <button
            onClick={() => setImagePreview(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            &times;
          </button>
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
