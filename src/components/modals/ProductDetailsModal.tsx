"use client";

import React from "react";
import { colors } from "@/utils/color";
import { FiX, FiPackage, FiTag, FiDollarSign, FiBox } from "react-icons/fi";
import Image from "next/image";

interface Product {
  id: number;
  productName: string;
  productDescription: string;
  productBrand: string;
  productCode?: string;
  productPrice: number;
  productDiscountPercentage?: number | null;
  productDiscountPrice?: number | null;
  availableStockQuantity: number;
  coverImageUrl: string;
  galleryImageUrls?: string[];
  productVideoUrl?: string;
  status: "pending" | "approved" | "rejected";
  productViewCount?: number;
  totalSoldCount?: number;
  productTags?: string | string[];
  productSizes?: string | string[];
  productColors?: string | string[];
  productWeight?: string;
  productDimensions?: string;
  productMaterial?: string;
  productWarrantyInfo?: string;
  productReturnPolicy?: string;
  stockKeepingUnit?: string;
  productModelNumber?: string;
  productBestSaleTag?: string;
  waxType?: string;
  singleOrCombo?: string;
  distributorPurchasePrice?: number;
  distributorSellingPrice?: number;
  retailerSellingPrice?: number;
  mrpB2B?: number;
  mrpB2C?: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    categoryName: string;
  };
  subcategory?: {
    subCategoryName: string;
  };
  seller?: {
    shopName?: string;
    sellerName: string;
    email?: string;
  };
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  if (!isOpen || !product) return null;

  const parseTags = (tags: string | string[] | undefined): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    try {
      return JSON.parse(tags);
    } catch {
      return tags.split(",").map((t) => t.trim());
    }
  };

  const productTags = parseTags(product.productTags);
  const productSizes = parseTags(product.productSizes);
  const productColors = parseTags(product.productColors);
  const galleryImages = Array.isArray(product.galleryImageUrls)
    ? product.galleryImageUrls
    : product.galleryImageUrls
    ? JSON.parse(product.galleryImageUrls)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10"
          style={{ borderColor: colors.lightgray }}
        >
          <h2
            className="text-2xl font-cinzel font-bold"
            style={{ color: colors.primeGreen }}
          >
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={24} style={{ color: colors.darkgray }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                {product.coverImageUrl ? (
                  <Image
                    src={product.coverImageUrl}
                    alt={product.productName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: colors.lightgray }}
                  >
                    <FiPackage size={48} style={{ color: colors.darkgray }} />
                  </div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative w-full h-20 rounded-lg overflow-hidden border"
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h3
                  className="text-2xl font-cinzel font-bold"
                  style={{ color: colors.primeGreen }}
                >
                  {product.productName}
                </h3>
                <p
                  className="text-sm font-poppins mt-1"
                  style={{ color: colors.darkgray }}
                >
                  {product.productBrand}
                </p>
              </div>

              {product.seller && (
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: colors.lightgray }}
                >
                  <p
                    className="text-xs font-poppins font-medium mb-1"
                    style={{ color: colors.darkgray }}
                  >
                    Seller Information
                  </p>
                  <p
                    className="font-poppins font-semibold"
                    style={{ color: colors.primeGreen }}
                  >
                    {product.seller.shopName || product.seller.sellerName}
                  </p>
                  {product.seller.email && (
                    <p
                      className="text-sm font-poppins"
                      style={{ color: colors.darkgray }}
                    >
                      {product.seller.email}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiDollarSign
                    size={20}
                    style={{ color: colors.primeGreen }}
                  />
                  <span
                    className="text-2xl font-cinzel font-bold"
                    style={{ color: colors.primeGreen }}
                  >
                    ₹{product.productPrice}
                  </span>
                  {product.productDiscountPrice && (
                    <span
                      className="text-lg font-poppins line-through"
                      style={{ color: colors.darkgray }}
                    >
                      ₹{product.productDiscountPrice}
                    </span>
                  )}
                </div>

                {product.productDiscountPercentage && (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-poppins font-medium"
                    style={{
                      backgroundColor: `${colors.primeRed}20`,
                      color: colors.primeRed,
                    }}
                  >
                    {product.productDiscountPercentage}% OFF
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FiBox size={20} style={{ color: colors.darkgray }} />
                <span className="font-poppins" style={{ color: colors.darkgray }}>
                  Stock: {product.availableStockQuantity} units
                </span>
              </div>

              {product.category && (
                <div className="flex items-center gap-2">
                  <FiTag size={20} style={{ color: colors.darkgray }} />
                  <span className="font-poppins" style={{ color: colors.darkgray }}>
                    {product.category.categoryName}
                    {product.subcategory && ` > ${product.subcategory.subCategoryName}`}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div>
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-poppins font-medium"
                  style={{
                    backgroundColor:
                      product.status === "approved"
                        ? `${colors.secondaryGreen}20`
                        : product.status === "pending"
                        ? `${colors.primeGold}20`
                        : `${colors.primeRed}20`,
                    color:
                      product.status === "approved"
                        ? colors.secondaryGreen
                        : product.status === "pending"
                        ? colors.primeGold
                        : colors.primeRed,
                  }}
                >
                  {product.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.productDescription && (
            <div>
              <h4
                className="text-lg font-cinzel font-bold mb-2"
                style={{ color: colors.primeGreen }}
              >
                Description
              </h4>
              <p
                className="font-poppins leading-relaxed"
                style={{ color: colors.darkgray }}
              >
                {product.productDescription}
              </p>
            </div>
          )}

          {/* Tags, Sizes, Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {productTags.length > 0 && (
              <div>
                <h5
                  className="text-sm font-poppins font-bold mb-2"
                  style={{ color: colors.primeGreen }}
                >
                  Tags
                </h5>
                <div className="flex flex-wrap gap-2">
                  {productTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-poppins"
                      style={{
                        backgroundColor: colors.lightgray,
                        color: colors.darkgray,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {productSizes.length > 0 && (
              <div>
                <h5
                  className="text-sm font-poppins font-bold mb-2"
                  style={{ color: colors.primeGreen }}
                >
                  Sizes
                </h5>
                <div className="flex flex-wrap gap-2">
                  {productSizes.map((size, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-poppins"
                      style={{
                        backgroundColor: colors.lightgray,
                        color: colors.darkgray,
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {productColors.length > 0 && (
              <div>
                <h5
                  className="text-sm font-poppins font-bold mb-2"
                  style={{ color: colors.primeGreen }}
                >
                  Colors
                </h5>
                <div className="flex flex-wrap gap-2">
                  {productColors.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-poppins"
                      style={{
                        backgroundColor: colors.lightgray,
                        color: colors.darkgray,
                      }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.productCode && (
              <DetailItem label="Product Code" value={product.productCode} />
            )}
            {product.stockKeepingUnit && (
              <DetailItem label="SKU" value={product.stockKeepingUnit} />
            )}
            {product.productModelNumber && (
              <DetailItem label="Model Number" value={product.productModelNumber} />
            )}
            {product.productWeight && (
              <DetailItem label="Weight" value={product.productWeight} />
            )}
            {product.productDimensions && (
              <DetailItem label="Dimensions" value={product.productDimensions} />
            )}
            {product.productMaterial && (
              <DetailItem label="Material" value={product.productMaterial} />
            )}
            {product.waxType && (
              <DetailItem label="Wax Type" value={product.waxType} />
            )}
            {product.singleOrCombo && (
              <DetailItem label="Type" value={product.singleOrCombo} />
            )}
          </div>

          {/* Pricing Details */}
          {(product.distributorPurchasePrice ||
            product.distributorSellingPrice ||
            product.retailerSellingPrice ||
            product.mrpB2B ||
            product.mrpB2C) && (
            <div>
              <h4
                className="text-lg font-cinzel font-bold mb-3"
                style={{ color: colors.primeGreen }}
              >
                Pricing Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.distributorPurchasePrice && (
                  <DetailItem
                    label="Distributor Purchase Price"
                    value={`₹${product.distributorPurchasePrice}`}
                  />
                )}
                {product.distributorSellingPrice && (
                  <DetailItem
                    label="Distributor Selling Price"
                    value={`₹${product.distributorSellingPrice}`}
                  />
                )}
                {product.retailerSellingPrice && (
                  <DetailItem
                    label="Retailer Selling Price"
                    value={`₹${product.retailerSellingPrice}`}
                  />
                )}
                {product.mrpB2B && (
                  <DetailItem label="MRP B2B" value={`₹${product.mrpB2B}`} />
                )}
                {product.mrpB2C && (
                  <DetailItem label="MRP B2C" value={`₹${product.mrpB2C}`} />
                )}
              </div>
            </div>
          )}

          {/* Policies */}
          {(product.productWarrantyInfo || product.productReturnPolicy) && (
            <div>
              <h4
                className="text-lg font-cinzel font-bold mb-3"
                style={{ color: colors.primeGreen }}
              >
                Policies
              </h4>
              {product.productWarrantyInfo && (
                <div className="mb-3">
                  <h5
                    className="text-sm font-poppins font-bold mb-1"
                    style={{ color: colors.darkgray }}
                  >
                    Warranty
                  </h5>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>
                    {product.productWarrantyInfo}
                  </p>
                </div>
              )}
              {product.productReturnPolicy && (
                <div>
                  <h5
                    className="text-sm font-poppins font-bold mb-1"
                    style={{ color: colors.darkgray }}
                  >
                    Return Policy
                  </h5>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>
                    {product.productReturnPolicy}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Views" value={product.productViewCount || 0} />
            <StatCard label="Sold" value={product.totalSoldCount || 0} />
            <StatCard
              label="Created"
              value={new Date(product.createdAt).toLocaleDateString()}
            />
            <StatCard
              label="Updated"
              value={new Date(product.updatedAt).toLocaleDateString()}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3"
          style={{ borderColor: colors.lightgray }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-poppins font-medium transition-colors"
            style={{
              backgroundColor: colors.lightgray,
              color: colors.darkgray,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        className="text-xs font-poppins font-medium mb-1"
        style={{ color: colors.darkgray }}
      >
        {label}
      </p>
      <p className="font-poppins" style={{ color: colors.primeGreen }}>
        {value}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="p-3 rounded-lg text-center"
      style={{ backgroundColor: colors.lightgray }}
    >
      <p
        className="text-xs font-poppins font-medium mb-1"
        style={{ color: colors.darkgray }}
      >
        {label}
      </p>
      <p
        className="text-lg font-cinzel font-bold"
        style={{ color: colors.primeGreen }}
      >
        {value}
      </p>
    </div>
  );
}
