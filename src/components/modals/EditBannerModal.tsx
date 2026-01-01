"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaUpload, FaTimes, FaImage, FaEdit } from "react-icons/fa";
import {
  updateHomepageBanner,
  updateWeeklyPromotionBanner,
  updateThePopularBanner,
  updateBrandPosterBanner,
  updateProductPosterAdsBanner,
  type HomepageBanner,
  type WeeklyPromotionBanner,
  type ThePopularBanner,
  type BrandPosterBanner,
  type ProductPosterAdsBanner,
} from "@/store/apis/banner/bannerApi";
import { useToast, Button, Input } from "@/components/atoms";

type BannerType = "homepage" | "weekly" | "popular" | "brand" | "product";

type Banner =
  | HomepageBanner
  | WeeklyPromotionBanner
  | ThePopularBanner
  | BrandPosterBanner
  | ProductPosterAdsBanner;

interface EditBannerModalProps {
  banner: Banner;
  bannerType: BannerType;
  onClose: () => void;
  onSuccess: () => void;
}

const EditBannerModal: React.FC<EditBannerModalProps> = ({
  banner,
  bannerType,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(banner.title);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(banner.image);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const bannerTypeLabels = {
    homepage: "Homepage Banner",
    weekly: "Weekly Promotion Banner",
    popular: "The Popular Banner",
    brand: "Brand Poster Banner",
    product: "Product Poster Ads Banner",
  };

  const bannerDimensions = {
    homepage: "1600x650px",
    weekly: "1300x400px",
    popular: "1300x400px",
    brand: "300x300px",
    product: "1300x400px",
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image file", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB", "error");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(banner.image);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      
      // Only append image if a new one was selected
      if (image) {
        formData.append("image", image);
      }

      switch (bannerType) {
        case "homepage":
          await updateHomepageBanner(banner.id, formData);
          break;
        case "weekly":
          await updateWeeklyPromotionBanner(banner.id, formData);
          break;
        case "popular":
          await updateThePopularBanner(banner.id, formData);
          break;
        case "brand":
          await updateBrandPosterBanner(banner.id, formData);
          break;
        case "product":
          await updateProductPosterAdsBanner(banner.id, formData);
          break;
      }

      onSuccess();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to update banner",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50  flex items-center justify-center z-40 p-4">
      <div className="bg-white  rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 ">
          <h2 className="text-xl font-bold text-gray-800 ">
            Edit {bannerTypeLabels[bannerType]}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700  text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Enter banner title"
              disabled={loading}
            />
          </div>

          {/* Image Upload/Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      disabled={loading}
                    >
                      <FaTimes />
                    </button>
                  )}
                  {image && (
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      New Image
                    </div>
                  )}
                </div>
              )}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300  rounded-lg p-6 text-center cursor-pointer hover:border-blue-500  transition-colors"
              >
                <FaImage className="mx-auto text-3xl text-gray-400 mb-2" />
                <p className="text-gray-600  mb-1">
                  {image ? "Click to change image" : "Click to update banner image"}
                </p>
                <p className="text-sm text-gray-500 ">
                  PNG, JPG or WEBP (Max 5MB)
                </p>
                {!image && (
                  <p className="text-xs text-gray-400 mt-2">
                    Leave unchanged to keep current image
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50  border border-blue-200  rounded-lg p-4">
            <h4 className="font-semibold text-blue-800  mb-2">
              Image Guidelines:
            </h4>
            <ul className="text-sm text-blue-700  space-y-1">
              <li>• Use high-quality images for better display</li>
              <li>• Recommended dimensions: {bannerDimensions[bannerType]}</li>
              <li>• Keep file size under 5MB</li>
              <li>• Ensure text in image is readable</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4 border-t border-gray-200 ">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaEdit />
                  Update Banner
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBannerModal;
