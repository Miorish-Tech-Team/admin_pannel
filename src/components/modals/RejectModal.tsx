"use client";

import React, { useState } from "react";
import { colors } from "@/utils/color";
import { Button, Textarea } from "@/components/atoms";
import { FaTimesCircle, FaTimes } from "react-icons/fa";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  sellerName: string;
  shopName: string;
  isLoading?: boolean;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sellerName,
  shopName,
  isLoading = false,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    if (rejectionReason.trim().length < 10) {
      setError("Reason must be at least 10 characters long");
      return;
    }

    onConfirm(rejectionReason);
  };

  const handleClose = () => {
    if (!isLoading) {
      setRejectionReason("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
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
          <h3 className="text-xl font-cinzel font-bold" style={{ color: colors.primeRed }}>
            Reject Seller Application
          </h3>
          <button
            onClick={handleClose}
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
              style={{ backgroundColor: `${colors.primeRed}20` }}
            >
              <FaTimesCircle size={24} style={{ color: colors.primeRed }} />
            </div>
            <div>
              <p className="font-poppins mb-2" style={{ color: colors.darkgray }}>
                You are about to reject the seller application for:
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
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: `${colors.primeRed}10` }}
          >
            <p className="font-poppins text-sm font-bold mb-2" style={{ color: colors.primeRed }}>
              Warning: This action cannot be undone
            </p>
            <p className="font-poppins text-xs" style={{ color: colors.darkgray }}>
              The seller account will be permanently deleted and they will receive an email with your rejection reason.
            </p>
          </div>

          <div>
            <label className="block font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
              Reason for Rejection *
            </label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setError("");
              }}
              placeholder="Please provide a detailed reason for rejecting this application. This will be sent to the seller via email."
              rows={5}
              disabled={isLoading}
              style={{
                borderColor: error ? colors.primeRed : colors.primeGold,
              }}
            />
            {error && (
              <p className="mt-2 text-sm font-poppins" style={{ color: colors.primeRed }}>
                {error}
              </p>
            )}
            <p className="mt-2 text-xs font-poppins" style={{ color: colors.darkgray }}>
              Minimum 10 characters required
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
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            Reject Application
          </Button>
        </div>
      </div>
    </div>
  );
};
