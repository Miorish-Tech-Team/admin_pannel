"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, useToast } from "@/components/atoms";
import {
  productApprovalApi,
  PendingProduct,
} from "@/store/apis/product/productApprovalApi";
import { productApi } from "@/store/apis/product";
import ProductDetailsModal from "@/components/modals/ProductDetailsModal";
import { colors } from "@/utils/color";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiCheck,
  FiX,
} from "react-icons/fi";
import Image from "next/image";

export default function ProductManagementPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Stats Data
  const [productCount, setProductCount] = useState(0);

  // Pending Products Data
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProductCount();
    fetchPendingProducts();
    fetchStatusCounts();
  }, []);

  const fetchProductCount = async () => {
    try {
      const response = await productApi.getProductCount();
      setProductCount(response.count);
    } catch (error: any) {
      console.error("Failed to fetch product count");
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const [approvedRes, rejectedRes] = await Promise.all([
        productApi.getProductsByStatus("approved", 1, 1),
        productApi.getProductsByStatus("rejected", 1, 1),
      ]);

      // Extract totalProducts from paginated response
      setApprovedCount(
        approvedRes.totalProducts ||
          (Array.isArray(approvedRes) ? approvedRes.length : 0)
      );
      setRejectedCount(
        rejectedRes.totalProducts ||
          (Array.isArray(rejectedRes) ? rejectedRes.length : 0)
      );
    } catch (error: any) {
      console.error("Failed to fetch status counts");
    }
  };

  const fetchPendingProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productApprovalApi.getPendingProducts();
      setPendingProducts(response.pendingProducts);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch pending products"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (productId: number) => {
    try {
      setProcessingId(productId);
      await productApprovalApi.approveProduct(productId);
      toast.success("Product approved successfully");
      setPendingProducts((prev) => prev.filter((p) => p.id !== productId));
      fetchProductCount();
      fetchStatusCounts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve product");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (productId: number) => {
    try {
      setProcessingId(productId);
      await productApprovalApi.rejectProduct(productId);
      toast.success("Product rejected successfully");
      setPendingProducts((prev) => prev.filter((p) => p.id !== productId));
      fetchProductCount();
      fetchStatusCounts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject product");
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetails = (product: PendingProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const pendingCount = pendingProducts.length;
  const totalProducts = productCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-cinzel font-bold"
            style={{ color: colors.primeGreen }}
          >
            Product Approval Management
          </h1>
          <p
            className="font-poppins text-sm mt-2"
            style={{ color: colors.darkgray }}
          >
            Review and approve seller products
          </p>
        </div>
      </div>


      {/* Pending Products Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: colors.lightgray }}
        >
          <h2
            className="text-xl font-cinzel font-bold"
            style={{ color: colors.primeGreen }}
          >
            Pending Approvals
            <span
              className="ml-3 px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: `${colors.primeGold}20`,
                color: colors.primeGold,
              }}
            >
              {pendingProducts.length}
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
          ) : pendingProducts.length === 0 ? (
            <div className="text-center py-12">
              <FiClock
                size={48}
                style={{ color: colors.lightgray }}
                className="mx-auto mb-4"
              />
              <p
                className="text-lg font-poppins"
                style={{ color: colors.darkgray }}
              >
                No pending products
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 flex items-center gap-4"
                  style={{ borderColor: colors.lightgray }}
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
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
                          size={24}
                          style={{ color: colors.darkgray }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3
                      className="font-poppins font-semibold"
                      style={{ color: colors.primeGreen }}
                    >
                      {product.productName}
                    </h3>
                    <p
                      className="text-sm font-poppins"
                      style={{ color: colors.darkgray }}
                    >
                      {product.productBrand}
                    </p>
                    {product.seller && (
                      <p
                        className="text-xs font-poppins mt-1"
                        style={{ color: colors.darkgray }}
                      >
                        Seller:{" "}
                        {product.seller.shopName || product.seller.sellerName}
                      </p>
                    )}
                    <p
                      className="text-lg font-poppins font-bold mt-2"
                      style={{ color: colors.primeGreen }}
                    >
                      ₹{product.productPrice}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(product)}
                    >
                      <FiEye size={16} />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(product.id)}
                      disabled={processingId === product.id}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <FiCheck size={16} />
                      {processingId === product.id ? "..." : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(product.id)}
                      disabled={processingId === product.id}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <FiX size={16} />
                      {processingId === product.id ? "..." : "Reject"}
                    </Button>
                  </div>
                </div>
              ))}{" "}
            </div>
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
