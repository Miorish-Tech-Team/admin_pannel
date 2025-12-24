"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, useToast } from "@/components/atoms";
import { productApi, Product } from "@/store/apis/product";
import ProductDetailsModal from "@/components/modals/ProductDetailsModal";
import { colors } from "@/utils/color";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Image from "next/image";

type Tab = "all" | "approved" | "pending" | "rejected";

export default function AllProductsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [productCount, setProductCount] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchProductCount();
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      fetchAllProducts();
    } else {
      fetchProductsByStatus(activeTab);
    }
  }, [activeTab, currentPage]);

  const fetchStatusCounts = async () => {
    try {
      const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
        productApi.getProductsByStatus("approved", 1, 1),
        productApi.getProductsByStatus("pending", 1, 1),
        productApi.getProductsByStatus("rejected", 1, 1),
      ]);
      
      // Extract totalProducts from paginated response
      const approvedTotal = (approvedRes as any).totalProducts || (Array.isArray(approvedRes) ? approvedRes.length : 0);
      const pendingTotal = (pendingRes as any).totalProducts || (Array.isArray(pendingRes) ? pendingRes.length : 0);
      const rejectedTotal = (rejectedRes as any).totalProducts || (Array.isArray(rejectedRes) ? rejectedRes.length : 0);
      
      setProductCount({
        total: productCount.total,
        approved: approvedTotal,
        pending: pendingTotal,
        rejected: rejectedTotal,
      });
    } catch (error: any) {
      console.error("Failed to fetch status counts");
    }
  };

  const fetchProductCount = async () => {
    try {
      const response = await productApi.getProductCount();
      setProductCount({
        total: response.count,
        approved: 0,
        pending: 0,
        rejected: 0,
      });
    } catch (error: any) {
      console.error("Failed to fetch product count");
    }
  };

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getAllProducts(currentPage, ITEMS_PER_PAGE);
      
      // Handle both paginated and non-paginated responses
      const productsData = (response as any).products || response;
      const total = (response as any).totalProducts || (Array.isArray(response) ? response.length : 0);
      const pages = (response as any).totalPages || Math.ceil(total / ITEMS_PER_PAGE);
      
      setProducts(Array.isArray(productsData) ? productsData : []);
      setTotalProducts(total);
      setTotalPages(pages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsByStatus = async (status: string) => {
    try {
      setIsLoading(true);
      const response = await productApi.getProductsByStatus(status, currentPage, ITEMS_PER_PAGE);
      
      // Handle both paginated and non-paginated responses
      const productsData = (response as any).products || response;
      const total = (response as any).totalProducts || (Array.isArray(response) ? response.length : 0);
      const pages = (response as any).totalPages || Math.ceil(total / ITEMS_PER_PAGE);
      
      setProducts(Array.isArray(productsData) ? productsData : []);
      setTotalProducts(total);
      setTotalPages(pages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    if (activeTab === "all") {
      fetchAllProducts();
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { bg: colors.secondaryGreen, text: "white", icon: FiCheckCircle, label: "Approved" },
      pending: { bg: colors.primeGold, text: "white", icon: FiClock, label: "Pending" },
      rejected: { bg: colors.primeRed, text: "white", icon: FiXCircle, label: "Rejected" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-poppins font-medium flex items-center gap-1 w-fit"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
            All Products
          </h1>
          <p className="font-poppins text-sm mt-2" style={{ color: colors.darkgray }}>
            View and manage all seller products
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleTabChange("all")}
          className={`bg-white rounded-lg shadow-md p-4 text-left transition-all ${
            activeTab === "all" ? "ring-2" : ""
          }`}
          style={{
            borderColor: activeTab === "all" ? colors.primeGreen : "transparent",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                Total Products
              </p>
              <p className="text-2xl font-cinzel font-bold mt-1" style={{ color: colors.primeGreen }}>
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
        </button>

        <button
          onClick={() => handleTabChange("approved")}
          className={`bg-white rounded-lg shadow-md p-4 text-left transition-all ${
            activeTab === "approved" ? "ring-2" : ""
          }`}
          style={{
            borderColor: activeTab === "approved" ? colors.secondaryGreen : "transparent",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                Approved
              </p>
              <p className="text-2xl font-cinzel font-bold mt-1" style={{ color: colors.secondaryGreen }}>
                {productCount.approved}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.secondaryGreen}20` }}
            >
              <FiCheckCircle size={24} style={{ color: colors.secondaryGreen }} />
            </div>
          </div>
        </button>

        <button
          onClick={() => handleTabChange("pending")}
          className={`bg-white rounded-lg shadow-md p-4 text-left transition-all ${
            activeTab === "pending" ? "ring-2" : ""
          }`}
          style={{
            borderColor: activeTab === "pending" ? colors.primeGold : "transparent",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                Pending
              </p>
              <p className="text-2xl font-cinzel font-bold mt-1" style={{ color: colors.primeGold }}>
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
        </button>

        <button
          onClick={() => handleTabChange("rejected")}
          className={`bg-white rounded-lg shadow-md p-4 text-left transition-all ${
            activeTab === "rejected" ? "ring-2" : ""
          }`}
          style={{
            borderColor: activeTab === "rejected" ? colors.primeRed : "transparent",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                Rejected
              </p>
              <p className="text-2xl font-cinzel font-bold mt-1" style={{ color: colors.primeRed }}>
                {productCount.rejected}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.primeRed}20` }}
            >
              <FiXCircle size={24} style={{ color: colors.primeRed }} />
            </div>
          </div>
        </button>
      </div>

      {/* Search Bar */}
      {activeTab === "all" && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={20}
                style={{ color: colors.darkgray }}
              />
              <input
                type="text"
                placeholder="Search products by name, brand, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg font-poppins"
                style={{ borderColor: colors.lightgray }}
              />
            </div>
            <Button type="submit">
              <FiSearch size={20} />
              Search
            </Button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: colors.lightgray }}>
          <h2 className="text-xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
            {activeTab === "all"
              ? "All Products"
              : activeTab === "approved"
              ? "Approved Products"
              : activeTab === "pending"
              ? "Pending Products"
              : "Rejected Products"}
            <span
              className="ml-3 px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: `${colors.primeGreen}20`,
                color: colors.primeGreen,
              }}
            >
              {totalProducts}
            </span>
          </h2>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div
                className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
                style={{ borderColor: colors.primeGreen }}
              ></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage size={48} style={{ color: colors.lightgray }} className="mx-auto mb-4" />
              <p className="text-lg font-poppins" style={{ color: colors.darkgray }}>
                No products found
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: colors.lightgray }}>
                      <th className="px-4 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider" style={{ color: colors.darkgray }}>
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider" style={{ color: colors.darkgray }}>
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider" style={{ color: colors.darkgray }}>
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider" style={{ color: colors.darkgray }}>
                        Stock
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider" style={{ color: colors.darkgray }}>
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-poppins font-medium uppercase tracking-wider" style={{ color: colors.darkgray }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: colors.lightgray }}>
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
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
                                  <FiPackage size={20} style={{ color: colors.darkgray }} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-poppins font-medium" style={{ color: colors.primeGreen }}>
                                {product.productName}
                              </p>
                              <p className="text-xs font-poppins" style={{ color: colors.darkgray }}>
                                {product.productBrand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                            {product.category?.categoryName || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-poppins font-medium" style={{ color: colors.primeGreen }}>
                            ₹{product.productPrice}
                          </p>
                          {product.productDiscountPrice && (
                            <p className="text-xs font-poppins line-through" style={{ color: colors.darkgray }}>
                              ₹{product.productDiscountPrice}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                            {product.availableStockQuantity}
                          </p>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(product.status)}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(product)}
                            >
                              <FiEye size={16} />
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} of {totalProducts}{" "}
                    products
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      <FiChevronLeft size={16} />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2 px-4">
                      <span className="font-poppins" style={{ color: colors.darkgray }}>
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      size="sm"
                    >
                      Next
                      <FiChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct as any}
      />
    </div>
  );
}
