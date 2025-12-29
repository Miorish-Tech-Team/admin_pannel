"use client";

import React, { useState } from "react";
import { colors } from "@/utils/color";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";
import { Button, Input } from "@/components/atoms";

interface DeleteSellerModalProps {
  sellerId: number;
  sellerName: string;
  shopName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sellerId: number) => void;
}

export default function DeleteSellerModal({
  sellerId,
  sellerName,
  shopName,
  isOpen,
  onClose,
  onConfirm,
}: DeleteSellerModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (confirmText.toLowerCase() !== "delete") return;

    setIsLoading(true);
    await onConfirm(sellerId);
    setIsLoading(false);
    setConfirmText("");
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg shadow-xl max-w-md w-full"
        style={{ backgroundColor: colors.white }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.lightgray }}
        >
          <div className="flex items-center gap-3">
            <FaExclamationCircle size={24} style={{ color: "#ef4444" }} />
            <h3 className="text-xl font-cinzel font-bold" style={{ color: "#ef4444" }}>
              Delete Seller
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
          >
            <FaTimes size={20} style={{ color: colors.darkgray }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div
            className="p-4 rounded-lg border-2"
            style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}
          >
            <p className="font-poppins text-sm font-semibold" style={{ color: "#991b1b" }}>
              ⚠️ Warning: This action cannot be undone!
            </p>
            <p className="font-poppins text-sm mt-2" style={{ color: "#7f1d1d" }}>
              Deleting this seller will permanently remove:
            </p>
            <ul className="list-disc list-inside font-poppins text-sm mt-2 space-y-1" style={{ color: "#7f1d1d" }}>
              <li>All seller account data</li>
              <li>Shop information and settings</li>
              <li>Associated products (may be affected)</li>
              <li>Order history and statistics</li>
            </ul>
          </div>

          <div>
            <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
              You are about to permanently delete:
            </p>
            <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: colors.lightgray }}>
              <p className="font-poppins text-sm font-semibold" style={{ color: colors.black }}>
                {shopName}
              </p>
              <p className="font-poppins text-xs mt-1" style={{ color: colors.darkgray }}>
                Owner: {sellerName}
              </p>
              <p className="font-poppins text-xs" style={{ color: colors.darkgray }}>
                ID: {sellerId}
              </p>
            </div>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: colors.darkgray }}>
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </label>
            <Input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
          </div>

          <div
            className="p-3 rounded-lg flex items-start gap-2"
            style={{ backgroundColor: "#fffbeb" }}
          >
            <FaExclamationCircle size={16} style={{ color: "#f59e0b", marginTop: 2 }} />
            <p className="font-poppins text-xs" style={{ color: "#78350f" }}>
              Consider suspending the seller account instead of deleting if you want to preserve the data for future reference.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: colors.lightgray }}
        >
          <Button
            onClick={handleClose}
            disabled={isLoading}
            variant="outline"
            size="md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || confirmText.toLowerCase() !== "delete"}
            variant="danger"
            size="md"
            isLoading={isLoading}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  );
}
