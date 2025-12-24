"use client";

import React, { useEffect, useState } from "react";
import { colors } from "@/utils/color";
import { Button, useToast, Input } from "@/components/atoms";
import {
  FiPackage,
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import Image from "next/image";

export default function SellerProductsPage() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [productCount, setProductCount] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const limit = 10;

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: {
        bg: `${colors.primeGreen}20`,
        color: colors.primeGreen,
        icon: <FiCheckCircle size={14} />,
        text: "Approved",
      },
      pending: {
        bg: `${colors.primeGold}20`,
        color: colors.primeGold,
        icon: <FiClock size={14} />,
        text: "Pending",
      },
      rejected: {
        bg: `${colors.primeRed}20`,
        color: colors.primeRed,
        icon: <FiAlertCircle size={14} />,
        text: "Rejected",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-poppins font-medium"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
          style={{ borderColor: colors.primeGreen }}
        ></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl sm:text-3xl font-cinzel font-bold"
          style={{ color: colors.primeGreen }}
        >
          Seller Products
        </h1>
        <p
          className="mt-2 font-poppins text-sm sm:text-base"
          style={{ color: colors.darkgray }}
        >
          View and manage seller product listings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-poppins"
                style={{ color: colors.darkgray }}
              >
                Total Products
              </p>
              <p
                className="text-2xl font-cinzel font-bold mt-1"
                style={{ color: colors.primeGreen }}
              >
                {productCount.total}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.primeGreen}20` }}
            >
              <FiPackage size={24} style={{ color: colors.primeGreen }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-poppins"
                style={{ color: colors.darkgray }}
              >
                Approved
              </p>
              <p
                className="text-2xl font-cinzel font-bold mt-1"
                style={{ color: colors.primeGreen }}
              >
                {productCount.approved}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.primeGreen}20` }}
            >
              <FiCheckCircle size={24} style={{ color: colors.primeGreen }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-poppins"
                style={{ color: colors.darkgray }}
              >
                Pending
              </p>
              <p
                className="text-2xl font-cinzel font-bold mt-1"
                style={{ color: colors.primeGold }}
              >
                {productCount.pending}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.primeGold}20` }}
            >
              <FiClock size={24} style={{ color: colors.primeGold }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-poppins"
                style={{ color: colors.darkgray }}
              >
                Rejected
              </p>
              <p
                className="text-2xl font-cinzel font-bold mt-1"
                style={{ color: colors.primeRed }}
              >
                {productCount.rejected}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.primeRed}20` }}
            >
              <FiAlertCircle size={24} style={{ color: colors.primeRed }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="flex items-center gap-2"
              >
                <FiSearch size={18} />
                Search
              </Button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 rounded-lg border font-poppins"
              style={{ borderColor: colors.lightgray, color: colors.darkgray }}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.lightgray }}>
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider"
                  style={{ color: colors.darkgray }}
                >
                  Product
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider"
                  style={{ color: colors.darkgray }}
                >
                  Category
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider"
                  style={{ color: colors.darkgray }}
                >
                  Price
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider"
                  style={{ color: colors.darkgray }}
                >
                  Stock
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider"
                  style={{ color: colors.darkgray }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider"
                  style={{ color: colors.darkgray }}
                >
                  Views
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: colors.lightgray }}
            >
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
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
                            <FiPackage
                              size={20}
                              style={{ color: colors.darkgray }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <p
                          className="font-poppins font-medium"
                          style={{ color: colors.primeGreen }}
                        >
                          {product.productName}
                        </p>
                        <p
                          className="text-xs font-poppins"
                          style={{ color: colors.darkgray }}
                        >
                          {product.productBrand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className="text-sm font-poppins"
                      style={{ color: colors.darkgray }}
                    >
                      {product.category?.categoryName || "N/A"}
                    </p>
                    <p
                      className="text-xs font-poppins"
                      style={{ color: colors.darkgray }}
                    >
                      {product.subCategory?.subCategoryName || ""}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className="font-poppins font-medium"
                      style={{ color: colors.primeGreen }}
                    >
                      ₹{product.productPrice}
                    </p>
                    {product.productDiscountPrice && (
                      <p
                        className="text-xs font-poppins line-through"
                        style={{ color: colors.darkgray }}
                      >
                        ₹{product.productDiscountPrice}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className="text-sm font-poppins"
                      style={{ color: colors.darkgray }}
                    >
                      {product.availableStockQuantity}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <FiEye size={16} style={{ color: colors.darkgray }} />
                      <p
                        className="text-sm font-poppins"
                        style={{ color: colors.darkgray }}
                      >
                        {product.productViewCount}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Products */}
        {products.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <FiPackage
              size={64}
              style={{ color: colors.lightgray }}
              className="mx-auto mb-4"
            />
            <h3
              className="text-xl font-cinzel font-bold mb-2"
              style={{ color: colors.primeGreen }}
            >
              No Products Found
            </h3>
            <p
              className="font-poppins text-sm"
              style={{ color: colors.darkgray }}
            >
              {searchQuery
                ? "Try adjusting your search or filters"
                : "No seller products available"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="px-6 py-4 border-t flex items-center justify-between"
            style={{ borderColor: colors.lightgray }}
          >
            <p
              className="text-sm font-poppins"
              style={{ color: colors.darkgray }}
            >
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
