"use client";

import React, { useState } from "react";
import { colors } from "@/utils/color";
import { Seller } from "@/store/apis/seller/sellerApi";
import { FaTimes, FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaCrown, FaImage, FaFileAlt, FaGlobe, FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/atoms";

interface SellerDetailsModalProps {
  seller: Seller;
  isOpen: boolean;
  onClose: () => void;
}

export default function SellerDetailsModal({
  seller,
  isOpen,
  onClose,
}: SellerDetailsModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#22c55e";
      case "suspended":
        return "#ef4444";
      case "deactive":
        return "#6b7280";
      default:
        return colors.darkgray;
    }
  };

  return (
    <>
      {!imagePreview && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.white }}
          >
          {/* Header */}
          <div
            className="sticky top-0 flex items-center justify-between p-6 border-b z-10"
            style={{ backgroundColor: colors.white, borderColor: colors.lightgray }}
          >
            <div className="flex items-center gap-3">
              <FaStore size={24} style={{ color: colors.primeGreen }} />
              <h3 className="text-xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
                Seller Details
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
          <div className="p-6 space-y-6">
            {/* Shop Logo */}
            {seller.shopLogo && (
              <div className="flex justify-center">
                <div className="relative group cursor-pointer" onClick={() => setImagePreview(seller.shopLogo || null)}>
                  <img
                    src={seller.shopLogo}
                    alt="Shop Logo"
                    className="w-32 h-32 object-cover rounded-lg shadow-md transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0  group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                    <FaImage className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </div>
              </div>
            )}

          {/* Shop Info */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold font-cinzel" style={{ color: colors.primeGreen }}>
              Shop Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                  Shop Name
                </label>
                <p className="font-poppins text-base mt-1" style={{ color: colors.black }}>
                  {seller.shopName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                  Business Type
                </label>
                <p className="font-poppins text-base mt-1" style={{ color: colors.black }}>
                  {seller.businessType}
                </p>
              </div>
              {seller.websiteURL && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium flex items-center gap-1" style={{ color: colors.darkgray }}>
                    <FaGlobe style={{ color: colors.primeGold }} size={12} />
                    Website
                  </label>
                  <a
                    href={seller.websiteURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-poppins text-sm mt-1 hover:underline"
                    style={{ color: colors.primeGreen }}
                  >
                    {seller.websiteURL}
                  </a>
                </div>
              )}
            </div>
            {seller.shopDescription && (
              <div>
                <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                  Description
                </label>
                <p className="font-poppins text-sm mt-1" style={{ color: colors.black }}>
                  {seller.shopDescription}
                </p>
              </div>
            )}
          </div>

          {/* Owner Info */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold font-cinzel" style={{ color: colors.primeGreen }}>
              Owner Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                  Owner Name
                </label>
                <p className="font-poppins text-base mt-1" style={{ color: colors.black }}>
                  {seller.sellerName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope style={{ color: colors.primeGold }} />
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                    Email
                  </label>
                  <p className="font-poppins text-sm mt-1" style={{ color: colors.black }}>
                    {seller.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone style={{ color: colors.primeGold }} />
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                    Contact Number
                  </label>
                  <p className="font-poppins text-base mt-1" style={{ color: colors.black }}>
                    {seller.contactNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold font-cinzel" style={{ color: colors.primeGreen }}>
              Address
            </h4>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt style={{ color: colors.primeGold, marginTop: 4 }} />
              <div className="flex-1">
                <p className="font-poppins text-sm" style={{ color: colors.black }}>
                  {seller.businessAddress}
                </p>
                <p className="font-poppins text-sm mt-1" style={{ color: colors.darkgray }}>
                  {seller.city}, {seller.state} {seller.zipCode}
                </p>
                <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
                  {seller.countryName}
                </p>
              </div>
            </div>
          </div>

          {/* Business Registration */}
          {(seller.businessRegistrationNumber || seller.taxIdentificationNumber) && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold font-cinzel" style={{ color: colors.primeGreen }}>
                Registration Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seller.businessRegistrationNumber && (
                  <div className="flex items-center gap-2">
                    <FaIdCard style={{ color: colors.primeGold }} />
                    <div>
                      <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                        Business Registration
                      </label>
                      <p className="font-poppins text-sm mt-1" style={{ color: colors.black }}>
                        {seller.businessRegistrationNumber}
                      </p>
                    </div>
                  </div>
                )}
                {seller.taxIdentificationNumber && (
                  <div className="flex items-center gap-2">
                    <FaIdCard style={{ color: colors.primeGold }} />
                    <div>
                      <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                        Tax ID
                      </label>
                      <p className="font-poppins text-sm mt-1" style={{ color: colors.black }}>
                        {seller.taxIdentificationNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status & Verification */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold font-cinzel" style={{ color: colors.primeGreen }}>
              Account Status
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.lightgray }}>
                <label className="text-xs font-medium" style={{ color: colors.darkgray }}>
                  Account Status
                </label>
                <p
                  className="font-poppins text-sm font-semibold mt-1 capitalize"
                  style={{ color: getStatusColor(seller.status) }}
                >
                  {seller.status}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.lightgray }}>
                <label className="text-xs font-medium" style={{ color: colors.darkgray }}>
                  Verified
                </label>
                <p
                  className="font-poppins text-sm font-semibold mt-1"
                  style={{ color: seller.isVerified ? "#22c55e" : "#ef4444" }}
                >
                  {seller.isVerified ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: colors.lightgray }}>
                <label className="text-xs font-medium" style={{ color: colors.darkgray }}>
                  Approved
                </label>
                <p
                  className="font-poppins text-sm font-semibold mt-1"
                  style={{ color: seller.isApproved ? "#22c55e" : "#ef4444" }}
                >
                  {seller.isApproved ? "Yes" : "No"}
                </p>
              </div>
              {seller.membershipId && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: colors.lightgray }}>
                  <label className="text-xs font-medium flex items-center gap-1" style={{ color: colors.darkgray }}>
                    <FaCrown size={10} style={{ color: colors.primeGold }} />
                    Membership
                  </label>
                  <p className="font-poppins text-sm font-semibold mt-1" style={{ color: colors.primeGold }}>
                    ID: {seller.membershipId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Membership Dates */}
          {seller.membershipId && (seller.membershipStart || seller.membershipEnd) && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold font-cinzel" style={{ color: colors.primeGreen }}>
                Membership Period
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seller.membershipStart && (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt style={{ color: colors.primeGold }} />
                    <div>
                      <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                        Start Date
                      </label>
                      <p className="font-poppins text-sm mt-1" style={{ color: colors.black }}>
                        {new Date(seller.membershipStart).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {seller.membershipEnd && (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt style={{ color: colors.primeGold }} />
                    <div>
                      <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                        End Date
                      </label>
                      <p className="font-poppins text-sm mt-1" style={{ color: colors.black }}>
                        {new Date(seller.membershipEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents */}
          {(seller.businessLicenseDocument || seller.taxDocument || seller.identityProof) && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold font-cinzel" style={{ color: colors.primeGreen }}>
                Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {seller.businessLicenseDocument && (
                  <div
                    className="p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all"
                    style={{ borderColor: colors.lightgray }}
                    onClick={() => setImagePreview(seller.businessLicenseDocument || null)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaFileAlt style={{ color: colors.primeGold }} />
                      <label className="text-xs font-medium" style={{ color: colors.darkgray }}>
                        Business License
                      </label>
                    </div>
                    <img
                      src={seller.businessLicenseDocument}
                      alt="Business License"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                {seller.taxDocument && (
                  <div
                    className="p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all"
                    style={{ borderColor: colors.lightgray }}
                    onClick={() => setImagePreview(seller.taxDocument || null)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaFileAlt style={{ color: colors.primeGold }} />
                      <label className="text-xs font-medium" style={{ color: colors.darkgray }}>
                        Tax Document
                      </label>
                    </div>
                    <img
                      src={seller.taxDocument}
                      alt="Tax Document"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                {seller.identityProof && (
                  <div
                    className="p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all"
                    style={{ borderColor: colors.lightgray }}
                    onClick={() => setImagePreview(seller.identityProof || null)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaFileAlt style={{ color: colors.primeGold }} />
                      <label className="text-xs font-medium" style={{ color: colors.darkgray }}>
                        Identity Proof
                      </label>
                    </div>
                    <img
                      src={seller.identityProof}
                      alt="Identity Proof"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                Registered On
              </label>
              <p className="font-poppins text-sm mt-1" style={{ color: colors.black }}>
                {new Date(seller.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: colors.darkgray }}>
                Last Updated
              </label>
              <p className="font-poppins text-sm mt-1" style={{ color: colors.black }}>
                {new Date(seller.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: colors.lightgray }}
        >
          <Button
            onClick={onClose}
            variant="outline"
            size="md"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
      )}

    {/* Image Preview Modal */}
    {imagePreview && (
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black flex items-center justify-center z-60 p-4"
        onClick={() => setImagePreview(null)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <button
            onClick={() => setImagePreview(null)}
            className="absolute top-4 right-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm z-10"
          >
            <FaTimes size={24} style={{ color: colors.white }} />
          </button>
          <img
            src={imagePreview}
            alt="Preview"
            className="min-w-full min-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    )}
  </>
  );
}
