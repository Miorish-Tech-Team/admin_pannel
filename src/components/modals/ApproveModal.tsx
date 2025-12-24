"use client";

import React from "react";
import { colors } from "@/utils/color";
import { Button } from "@/components/atoms";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sellerName: string;
  shopName: string;
  isLoading?: boolean;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sellerName,
  shopName,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: colors.white }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.offYellow }}
        >
          <h3 className="text-xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
            Approve Seller
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="hover:opacity-70 transition-opacity disabled:opacity-50"
            style={{ color: colors.darkgray }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${colors.secondaryGreen}20` }}
            >
              <FaCheckCircle size={24} style={{ color: colors.secondaryGreen }} />
            </div>
            <div>
              <p className="font-poppins mb-2" style={{ color: colors.darkgray }}>
                Are you sure you want to approve the seller account for:
              </p>
              <p className="font-cinzel font-bold text-lg" style={{ color: colors.primeGreen }}>
                {shopName}
              </p>
              <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
                Owner: {sellerName}
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-lg mb-6"
            style={{ backgroundColor: `${colors.secondaryGreen}10` }}
          >
            <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
              Once approved, the seller will receive an email notification and will be able to access their dashboard.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 p-6 border-t"
          style={{ borderColor: colors.offYellow }}
        >
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            Approve Seller
          </Button>
        </div>
      </div>
    </div>
  );
};
