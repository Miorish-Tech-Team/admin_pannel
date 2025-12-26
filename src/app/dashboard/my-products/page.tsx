"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Input, Select, useToast } from "@/components/atoms";
import {
  adminMyProductsApi,
  Product,
} from "@/store/apis/product/sellerProductApi";
import { colors } from "@/utils/color";
import { FiPlus, FiEdit, FiEye } from "react-icons/fi";
import Image from "next/image";
import { TableSkeleton } from "@/components/skeletons";

export default function MyProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productCounts, setProductCounts] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchProductCounts();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, statusFilter, searchQuery]);

  const fetchProductCounts = async () => {
    try {
      const response = await adminMyProductsApi.getMyProductCount();
      setProductCounts(response.count);
    } catch (error: any) {
      console.error("Failed to fetch product counts:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsInitialLoading(true);
      // Fetch all products at once for local filtering
      const response = await adminMyProductsApi.getMyProducts(1, 1000, "");
      setProducts(response.products);
      setTotalProducts(response.totalProducts);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch products");
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsInitialLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.productName.toLowerCase().includes(query) ||
          (p.productCode && p.productCode.toLowerCase().includes(query)) ||
          (p.productBrand && p.productBrand.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: {
        bg: `${colors.primeGreen}20`,
        color: colors.primeGreen,
        text: "Approved",
      },
      pending: {
        bg: `${colors.primeGold}20`,
        color: colors.primeGold,
        text: "Pending",
      },
      rejected: {
        bg: `${colors.primeRed}20`,
        color: colors.primeRed,
        text: "Rejected",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span
        className="px-3 py-1 rounded-full text-sm font-poppins capitalize"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.text}
      </span>
    );
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span
          className="px-3 py-1 rounded-full text-sm font-poppins font-medium"
          style={{
            backgroundColor: `${colors.primeRed}20`,
            color: colors.primeRed,
          }}
        >
          Out of Stock
        </span>
      );
    } else if (stock < 10) {
      return (
        <span
          className="px-3 py-1 rounded-full text-sm font-poppins font-medium"
          style={{
            backgroundColor: `${colors.primeGold}20`,
            color: colors.primeGold,
          }}
        >
          Low Stock ({stock})
        </span>
      );
    } else {
      return (
        <span
          className="px-3 py-1 rounded-full text-sm font-poppins font-medium"
          style={{
            backgroundColor: `${colors.secondaryGreen}20`,
            color: colors.secondaryGreen,
          }}
        >
          In Stock ({stock})
        </span>
      );
    }
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold font-cinzel"
            style={{ color: colors.primeGreen }}
          >
            My Products
          </h1>
          <p className="mt-1 font-poppins text-gray-600">
            Manage your product inventory
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => handleStatusChange("all")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-poppins mb-1"
                style={{ color: colors.darkgray }}
              >
                Total Products
              </p>
              <p
                className="text-3xl font-cinzel font-bold"
                style={{ color: colors.primeGreen }}
              >
                {productCounts.total}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.primeGreen}20` }}
            >
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => handleStatusChange("approved")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-poppins mb-1"
                style={{ color: colors.darkgray }}
              >
                Approved
              </p>
              <p
                className="text-3xl font-cinzel font-bold"
                style={{ color: colors.primeGreen }}
              >
                {productCounts.approved}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.primeGreen}20` }}
            >
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => handleStatusChange("pending")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-poppins mb-1"
                style={{ color: colors.darkgray }}
              >
                Pending
              </p>
              <p
                className="text-3xl font-cinzel font-bold"
                style={{ color: colors.primeGold }}
              >
                {productCounts.pending}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.primeGold}20` }}
            >
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg"
          onClick={() => handleStatusChange("rejected")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-poppins mb-1"
                style={{ color: colors.darkgray }}
              >
                Rejected
              </p>
              <p
                className="text-3xl font-cinzel font-bold"
                style={{ color: colors.primeRed }}
              >
                {productCounts.rejected}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.primeRed}20` }}
            >
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by product name, code, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={[
                { value: "all", label: "All Status" },
                { value: "approved", label: "Approved" },
                { value: "pending", label: "Pending" },
                { value: "rejected", label: "Rejected" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isInitialLoading ? (
          <TableSkeleton />
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.darkgray}20` }}
            >
              <span className="text-4xl">📦</span>
            </div>
            <h3
              className="text-xl font-cinzel font-bold mb-2"
              style={{ color: colors.primeGreen }}
            >
              No Products Found
            </h3>
            <p className="font-poppins mb-6" style={{ color: colors.darkgray }}>
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters or search query"
                : "You haven't added any products yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.base }}>
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-sm font-poppins font-semibold"
                      style={{ color: colors.primeGreen }}
                    >
                      Product
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-poppins font-semibold"
                      style={{ color: colors.primeGreen }}
                    >
                      Category
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-poppins font-semibold"
                      style={{ color: colors.primeGreen }}
                    >
                      Price
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-poppins font-semibold"
                      style={{ color: colors.primeGreen }}
                    >
                      Stock
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-poppins font-semibold"
                      style={{ color: colors.primeGreen }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-poppins font-semibold"
                      style={{ color: colors.primeGreen }}
                    >
                      Stats
                    </th>
                    <th
                      className="px-6 py-4 text-right text-sm font-poppins font-semibold"
                      style={{ color: colors.primeGreen }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: colors.lightgray,
                      }}
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {product.coverImageUrl ? (
                              <Image
                                src={product.coverImageUrl}
                                alt={product.productName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400">📦</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/dashboard/products/${product.id}`}
                              className="font-poppins font-medium hover:underline block truncate"
                              style={{ color: colors.primeGreen }}
                            >
                              {product.productName}
                            </Link>
                            <p
                              className="text-xs font-poppins mt-0.5 truncate"
                              style={{ color: colors.darkgray }}
                            >
                              {product.productBrand}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p
                            className="text-sm font-poppins truncate"
                            style={{ color: colors.darkgray }}
                          >
                            {product.category?.categoryName || "N/A"}
                          </p>
                          
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        {product.productDiscountPrice &&
                        product.productDiscountPrice > 0 ? (
                          <>
                            {/* 1. Show the Discounted Price as the primary price */}
                            <p
                              className="text-sm font-poppins font-medium"
                              style={{ color: colors.primeGreen }}
                            >
                              ₹{product.productDiscountPrice}
                            </p>

                            {/* 2. Show the Original Price with a line-through */}
                            <p
                              className="text-xs font-poppins line-through mt-0.5"
                              style={{ color: colors.darkgray }}
                            >
                              ₹{product.productPrice}
                            </p>
                          </>
                        ) : (
                          /* 3. If no discount, show only the Original Price normally */
                          <p
                            className="text-sm font-poppins font-medium"
                            style={{ color: colors.primeGreen }}
                          >
                            ₹{product.productPrice}
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        {getStockBadge(product.availableStockQuantity)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {getStatusBadge(product.status)}
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p
                            className="text-xs font-poppins"
                            style={{ color: colors.darkgray }}
                          >
                            👁️ {product.productViewCount} views
                          </p>
                          <p
                            className="text-xs font-poppins"
                            style={{ color: colors.darkgray }}
                          >
                            📦 {product.totalSoldCount} sold
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/products/${product.id}`}>
                            <button
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              title="View Details"
                            >
                              <FiEye
                                size={18}
                                style={{ color: colors.primeGreen }}
                              />
                            </button>
                          </Link>
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <button
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Edit Product"
                            >
                              <FiEdit
                                size={18}
                                style={{ color: colors.primeGold }}
                              />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                  Showing {products.length} of {totalProducts} products
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <span
                    className="px-4 py-2 text-sm font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
