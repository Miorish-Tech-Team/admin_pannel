"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/color";
import { Button, useToast } from "@/components/atoms";
import { ApproveModal, RejectModal } from "@/components/modals";
import { sellerApi, PendingSeller } from "@/store/apis/seller/sellerApi";
import { useRouter } from "next/navigation";
import { FaUser, FaStore, FaEnvelope, FaPhone, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function PendingSellersPage() {
  const router = useRouter();
  const toast = useToast();
  const [sellers, setSellers] = useState<PendingSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<PendingSeller | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      setIsLoading(true);
      const response = await sellerApi.getPendingSellers();
      if (response.success && response.data) {
        setSellers(response.data.pendingSellers || []);
      }
    } catch (error: any) {
        console.log(error.response?.data?.message || "Failed to fetch pending sellers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (sellerId: number) => {
    router.push(`/dashboard/sellers/pending/${sellerId}`);
  };

  const openApproveModal = (seller: PendingSeller) => {
    setSelectedSeller(seller);
    setIsApproveModalOpen(true);
  };

  const openRejectModal = (seller: PendingSeller) => {
    setSelectedSeller(seller);
    setIsRejectModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedSeller) return;

    try {
      setIsProcessing(true);
      const response = await sellerApi.approveSeller(selectedSeller.id);
      toast.success(response.message || "Seller approved successfully");
      setIsApproveModalOpen(false);
      setSelectedSeller(null);
      fetchPendingSellers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve seller");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (rejectionReason: string) => {
    if (!selectedSeller) return;

    try {
      setIsProcessing(true);
      const response = await sellerApi.rejectSeller(selectedSeller.id, rejectionReason);
      toast.success(response.message || "Seller rejected successfully");
      setIsRejectModalOpen(false);
      setSelectedSeller(null);
      fetchPendingSellers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject seller");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
          Pending Seller Approvals
        </h2>
        <p className="mt-1 font-poppins text-sm" style={{ color: colors.darkgray }}>
          Review and approve or reject seller applications
        </p>
      </div>

      {/* Sellers List */}
      {sellers.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: colors.white }}
        >
          <FaCheckCircle size={48} className="mx-auto mb-4" style={{ color: colors.primeGold }} />
          <h3 className="text-xl font-cinzel font-bold mb-2" style={{ color: colors.primeGreen }}>
            No Pending Approvals
          </h3>
          <p className="font-poppins" style={{ color: colors.darkgray }}>
            All seller applications have been processed
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: colors.white }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Seller Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${colors.primeGold}20` }}
                    >
                      <FaStore size={20} style={{ color: colors.primeGold }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-cinzel font-bold" style={{ color: colors.primeGreen }}>
                        {seller.shopName}
                      </h3>
                      <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                        Owner: {seller.sellerName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-poppins">
                    <div className="flex items-center gap-2">
                      <FaEnvelope style={{ color: colors.primeGold }} />
                      <span style={{ color: colors.darkgray }}>{seller.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone style={{ color: colors.primeGold }} />
                      <span style={{ color: colors.darkgray }}>{seller.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser style={{ color: colors.primeGold }} />
                      <span style={{ color: colors.darkgray }}>{seller.businessType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock style={{ color: colors.primeGold }} />
                      <span style={{ color: colors.darkgray }}>
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {seller.isVerified ? (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-poppins font-medium"
                        style={{ backgroundColor: `${colors.secondaryGreen}20`, color: colors.secondaryGreen }}
                      >
                        <FaCheckCircle size={12} />
                        Email Verified
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-poppins font-medium"
                        style={{ backgroundColor: `${colors.primeRed}20`, color: colors.primeRed }}
                      >
                        <FaTimesCircle size={12} />
                        Email Not Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(seller.id)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openApproveModal(seller)}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openRejectModal(seller)}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedSeller && (
        <>
          <ApproveModal
            isOpen={isApproveModalOpen}
            onClose={() => {
              setIsApproveModalOpen(false);
              setSelectedSeller(null);
            }}
            onConfirm={handleApprove}
            sellerName={selectedSeller.sellerName}
            shopName={selectedSeller.shopName}
            isLoading={isProcessing}
          />
          <RejectModal
            isOpen={isRejectModalOpen}
            onClose={() => {
              setIsRejectModalOpen(false);
              setSelectedSeller(null);
            }}
            onConfirm={handleReject}
            sellerName={selectedSeller.sellerName}
            shopName={selectedSeller.shopName}
            isLoading={isProcessing}
          />
        </>
      )}
    </div>
  );
}
