"use client";

import React, { useState } from "react";
import { colors } from "@/utils/color";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/atoms";

interface UpdateSellerStatusModalProps {
  sellerId: number;
  sellerName: string;
  currentStatus: "active" | "suspended" | "deactive";
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sellerId: number, status: "active" | "suspended" | "deactive") => void;
}

export default function UpdateSellerStatusModal({
  sellerId,
  sellerName,
  currentStatus,
  isOpen,
  onClose,
  onConfirm,
}: UpdateSellerStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<"active" | "suspended" | "deactive">(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsLoading(true);
    await onConfirm(sellerId, selectedStatus);
    setIsLoading(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "#22c55e",
          bg: "#dcfce7",
          description: "Seller can access their account and manage products",
        };
      case "suspended":
        return {
          color: "#ef4444",
          bg: "#fee2e2",
          description: "Seller's account is temporarily suspended from operations",
        };
      case "deactive":
        return {
          color: "#6b7280",
          bg: "#f3f4f6",
          description: "Seller's account is deactivated and cannot access the platform",
        };
      default:
        return { color: colors.darkgray, bg: colors.lightgray, description: "" };
    }
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
            <FaExclamationTriangle size={24} style={{ color: colors.primeGold }} />
            <h3 className="text-xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
              Update Seller Status
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
          >
            <FaTimes size={20} style={{ color: colors.darkgray }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
              You are about to change the status for:
            </p>
            <p className="font-poppins text-base font-semibold mt-1" style={{ color: colors.black }}>
              {sellerName} (ID: {sellerId})
            </p>
          </div>

          {/* Current Status */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: colors.lightgray }}>
            <label className="text-xs font-medium" style={{ color: colors.darkgray }}>
              Current Status
            </label>
            <p
              className="font-poppins text-sm font-semibold mt-1 capitalize"
              style={{ color: getStatusInfo(currentStatus).color }}
            >
              {currentStatus}
            </p>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
              Select New Status
            </label>
            <div className="space-y-2">
              {(["active", "suspended", "deactive"] as const).map((status) => {
                const statusInfo = getStatusInfo(status);
                const isSelected = selectedStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                      isSelected ? "shadow-md" : "hover:shadow-sm"
                    }`}
                    style={{
                      backgroundColor: isSelected ? statusInfo.bg : colors.white,
                      borderColor: isSelected ? statusInfo.color : colors.lightgray,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="font-poppins text-sm font-semibold capitalize"
                        style={{ color: statusInfo.color }}
                      >
                        {status}
                      </span>
                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="white"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="font-poppins text-xs" style={{ color: colors.darkgray }}>
                      {statusInfo.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedStatus !== currentStatus && (
            <div
              className="p-3 rounded-lg flex items-start gap-2"
              style={{ backgroundColor: "#fff7ed" }}
            >
              <FaExclamationTriangle size={16} style={{ color: "#f59e0b", marginTop: 2 }} />
              <p className="font-poppins text-xs" style={{ color: "#92400e" }}>
                This action will immediately change the seller's account status. Make sure you want
                to proceed.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: colors.lightgray }}
        >
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
            size="md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || selectedStatus === currentStatus}
            variant="primary"
            size="md"
            isLoading={isLoading}
          >
            Update Status
          </Button>
        </div>
      </div>
    </div>
  );
}
