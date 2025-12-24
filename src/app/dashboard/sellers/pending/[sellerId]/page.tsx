"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/color";
import { Button, useToast } from "@/components/atoms";
import { ApproveModal, RejectModal } from "@/components/modals";
import { sellerApi, PendingSeller } from "@/store/apis/seller/sellerApi";
import { useRouter, useParams } from "next/navigation";
import {
  FaArrowLeft,
  FaStore,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaFileAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import Image from "next/image";

export default function SellerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const sellerId = parseInt(params.sellerId as string);

  const [seller, setSeller] = useState<PendingSeller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    if (sellerId) {
      fetchSellerDetails();
    }
  }, [sellerId]);

  const fetchSellerDetails = async () => {
    try {
      setIsLoading(true);
      const response = await sellerApi.getSellerById(sellerId);
      if (response.success && response.data) {
        setSeller(response.data.seller);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch seller details");
      router.push("/dashboard/sellers/pending");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      const response = await sellerApi.approveSeller(sellerId);
      toast.success(response.message || "Seller approved successfully");
      setIsApproveModalOpen(false);
      router.push("/dashboard/sellers/pending");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve seller");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (rejectionReason: string) => {
    try {
      setIsProcessing(true);
      const response = await sellerApi.rejectSeller(sellerId, rejectionReason);
      toast.success(response.message || "Seller rejected successfully");
      setIsRejectModalOpen(false);
      router.push("/dashboard/sellers/pending");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject seller");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-cinzel font-bold" style={{ color: colors.primeRed }}>
            Seller not found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <FaArrowLeft />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
            Seller Application Details
          </h1>
          <p className="mt-1 font-poppins text-sm" style={{ color: colors.darkgray }}>
            Review all information before approval
          </p>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className="mb-6 p-4 rounded-xl flex items-center justify-between"
        style={{ backgroundColor: seller.isVerified ? `${colors.secondaryGreen}20` : `${colors.primeRed}20` }}
      >
        <div className="flex items-center gap-3">
          {seller.isVerified ? (
            <FaCheckCircle size={24} style={{ color: colors.secondaryGreen }} />
          ) : (
            <FaTimesCircle size={24} style={{ color: colors.primeRed }} />
          )}
          <div>
            <h3 className="font-cinzel font-bold" style={{ color: seller.isVerified ? colors.secondaryGreen : colors.primeRed }}>
              {seller.isVerified ? "Email Verified" : "Email Not Verified"}
            </h3>
            <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
              Application submitted on {new Date(seller.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl p-6" style={{ backgroundColor: colors.white }}>
          <h2 className="text-xl font-cinzel font-bold mb-4 flex items-center gap-2" style={{ color: colors.primeGreen }}>
            <FaStore />
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField icon={<FaStore />} label="Shop Name" value={seller.shopName} />
            <InfoField icon={<FaUser />} label="Owner Name" value={seller.sellerName} />
            <InfoField icon={<FaEnvelope />} label="Email" value={seller.email} />
            <InfoField icon={<FaPhone />} label="Contact Number" value={seller.contactNumber} />
            <InfoField icon={<FaBuilding />} label="Business Type" value={seller.businessType} />
            <InfoField icon={<FaFileAlt />} label="Registration Number" value={seller.businessRegistrationNumber} />
            <InfoField icon={<FaFileAlt />} label="Tax ID" value={seller.taxIdentificationNumber} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-poppins font-medium mb-2 text-gray-400">
              Business Address
            </label>
            <p className="font-poppins" style={{ color: colors.primeGreen }}>
              {seller.businessAddress}
            </p>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-poppins font-medium mb-2 text-gray-400">
              Shop Description
            </label>
            <p className="font-poppins" style={{ color: colors.primeGreen }}>
              {seller.shopDescription}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl p-6" style={{ backgroundColor: colors.white }}>
          <h2 className="text-xl font-cinzel font-bold mb-4 flex items-center gap-2" style={{ color: colors.primeGreen }}>
            <FaMapMarkerAlt />
            Location Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField icon={<FaMapMarkerAlt />} label="Country" value={seller.countryName} />
            <InfoField icon={<FaMapMarkerAlt />} label="State" value={seller.state} />
            <InfoField icon={<FaMapMarkerAlt />} label="City" value={seller.city} />
            <InfoField icon={<FaMapMarkerAlt />} label="Zip Code" value={seller.zipCode} />
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-xl p-6" style={{ backgroundColor: colors.white }}>
          <h2 className="text-xl font-cinzel font-bold mb-4 flex items-center gap-2" style={{ color: colors.primeGreen }}>
            <FaFileAlt />
            Uploaded Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DocumentCard label="Shop Logo" url={seller.shopLogo} />
            <DocumentCard label="Business License" url={seller.businessLicenseDocument} />
            <DocumentCard label="Tax Document" url={seller.taxDocument} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsApproveModalOpen(true)}
            disabled={isProcessing}
            className="flex-1"
          >
            <FaCheckCircle />
            Approve Seller
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={() => setIsRejectModalOpen(true)}
            disabled={isProcessing}
            className="flex-1"
          >
            <FaTimesCircle />
            Reject Application
          </Button>
        </div>
      </div>

      {/* Modals */}
      {seller && (
        <>
          <ApproveModal
            isOpen={isApproveModalOpen}
            onClose={() => setIsApproveModalOpen(false)}
            onConfirm={handleApprove}
            sellerName={seller.sellerName}
            shopName={seller.shopName}
            isLoading={isProcessing}
          />
          <RejectModal
            isOpen={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            onConfirm={handleReject}
            sellerName={seller.sellerName}
            shopName={seller.shopName}
            isLoading={isProcessing}
          />
        </>
      )}
    </div>
  );
}

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoField({ icon, label, value }: InfoFieldProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-poppins font-medium mb-1 text-gray-400">
        <span style={{ color: colors.primeGold }}>{icon}</span>
        {label}
      </label>
      <p className="font-poppins font-medium" style={{ color: colors.primeGreen }}>
        {value}
      </p>
    </div>
  );
}

interface DocumentCardProps {
  label: string;
  url: string;
}

function DocumentCard({ label, url }: DocumentCardProps) {
  return (
    <div className="border-2 rounded-lg p-4" style={{ borderColor: colors.primeGold }}>
      <h4 className="font-poppins font-medium mb-2 text-sm" style={{ color: colors.darkgray }}>
        {label}
      </h4>
      <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden" style={{ backgroundColor: colors.base }}>
        <Image
          src={url}
          alt={label}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-poppins font-medium hover:underline"
        style={{ color: colors.primeGreen }}
      >
        <FaExternalLinkAlt size={12} />
        View Document
      </a>
    </div>
  );
}
