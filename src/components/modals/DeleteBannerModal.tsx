"use client";

import React, { useState } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { Button, Input } from "@/components/atoms";

type BannerType = "homepage" | "weekly" | "popular" | "brand" | "product";

interface Banner {
  id: number;
  title: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface DeleteBannerModalProps {
  banner: Banner;
  bannerType: BannerType;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteBannerModal: React.FC<DeleteBannerModalProps> = ({
  banner,
  bannerType,
  onClose,
  onConfirm,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const bannerTypeLabels = {
    homepage: "Homepage Banner",
    weekly: "Weekly Promotion Banner",
    popular: "The Popular Banner",
    brand: "Brand Poster Banner",
    product: "Product Poster Ads Banner",
  };

  const handleConfirm = async () => {
    if (confirmText !== "Delete") {
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const isConfirmDisabled = confirmText !== "Delete" || loading;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white dark:bg-gray-100 rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
              <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-cinzel ">
              Delete Banner
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
         

          {/* Banner Preview */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium ">
                {bannerTypeLabels[bannerType]}
              </p>
            </div>
            <div className="p-4">
              <div className="flex gap-4">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {banner.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {banner.id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Created: {new Date(banner.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block  font-medium text-gray-700 mb-2">
              Type <span className="font-bold text-red-600">Delete</span> to confirm:
            </label>
            <Input
              type="text"
              value={confirmText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmText(e.target.value)}
              placeholder="Type Delete to confirm"
              disabled={loading}
              className="font-mono"
            />
            {confirmText && confirmText !== "Delete" && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                Please type exactly "Delete" to confirm
              </p>
            )}
          </div>

          {/* Impact Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              What will happen:
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
              <li>• The banner will be removed from the website</li>
              <li>• Users will no longer see this banner</li>
              <li>• The banner image will be deleted</li>
              <li>• This action is permanent and cannot be reversed</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            variant="danger"
            disabled={isConfirmDisabled}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete Banner"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBannerModal;
