"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/color";
import { 
  FaStore, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSpinner,
  FaSearchPlus
} from "react-icons/fa";
import { sellerApi, Seller } from "@/store/apis/seller/sellerApi";
import SellerDetailsModal from "@/components/modals/SellerDetailsModal";
import UpdateSellerStatusModal from "@/components/modals/UpdateSellerStatusModal";
import DeleteSellerModal from "@/components/modals/DeleteSellerModal";
import SearchSellerModal from "@/components/modals/SearchSellerModal";
import { useToast, Input, Select, Button } from "@/components/atoms";

export default function AllSellersPage() {
  const { success, error } = useToast();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "deactive">("all");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "unverified">("all");
  const [approvedFilter, setApprovedFilter] = useState<"all" | "approved" | "unapproved">("all");
  
  // Modals
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [sellers, searchTerm, statusFilter, verifiedFilter, approvedFilter]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await sellerApi.getAllSellers();
      setSellers(response.sellers);
    } catch (err) {
      console.error("Error fetching sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterSellers = () => {
    let filtered = [...sellers];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (seller) =>
          seller.shopName.toLowerCase().includes(search) ||
          seller.sellerName.toLowerCase().includes(search) ||
          seller.email.toLowerCase().includes(search) ||
          seller.contactNumber.includes(search)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((seller) => seller.status === statusFilter);
    }

    // Verified filter
    if (verifiedFilter === "verified") {
      filtered = filtered.filter((seller) => seller.isVerified);
    } else if (verifiedFilter === "unverified") {
      filtered = filtered.filter((seller) => !seller.isVerified);
    }

    // Approved filter
    if (approvedFilter === "approved") {
      filtered = filtered.filter((seller) => seller.isApproved);
    } else if (approvedFilter === "unapproved") {
      filtered = filtered.filter((seller) => !seller.isApproved);
    }

    setFilteredSellers(filtered);
  };

  const handleViewDetails = (seller: Seller) => {
    setSelectedSeller(seller);
    setDetailsModalOpen(true);
  };

  const handleUpdateStatus = (seller: Seller) => {
    setSelectedSeller(seller);
    setStatusModalOpen(true);
  };

  const handleDelete = (seller: Seller) => {
    setSelectedSeller(seller);
    setDeleteModalOpen(true);
  };

  const confirmUpdateStatus = async (sellerId: number, status: "active" | "suspended" | "deactive") => {
    try {
      await sellerApi.updateSellerStatus(sellerId, status);
      success("Seller status updated successfully");
      setStatusModalOpen(false);
      fetchSellers();
    } catch (err) {
      console.error("Error updating seller status:", err);
      error("Failed to update seller status");
    }
  };

  const confirmDelete = async (sellerId: number) => {
    try {
      await sellerApi.deleteSeller(sellerId);
      success("Seller deleted successfully");
      setDeleteModalOpen(false);
      fetchSellers();
    } catch (err) {
      console.error("Error deleting seller:", err);
      error("Failed to delete seller");
    }
  };

  const handleSellerFound = (seller: Seller) => {
    setSelectedSeller(seller);
    setDetailsModalOpen(true);
  };

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

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "active":
        return "#dcfce7";
      case "suspended":
        return "#fee2e2";
      case "deactive":
        return "#f3f4f6";
      default:
        return colors.lightgray;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
            All Sellers
          </h2>
          <p className="mt-1 font-poppins text-sm" style={{ color: colors.darkgray }}>
            View and manage all registered sellers
          </p>
        </div>
        <Button
          onClick={() => setSearchModalOpen(true)}
          variant="primary"
          size="md"
        >
          <FaSearchPlus />
          Advanced Search
        </Button>
      </div>

      {/* Filters & Search */}
      <div
        className="p-4 rounded-lg mb-6 space-y-4"
        style={{ backgroundColor: colors.white }}
      >
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by shop name, owner, email, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
              { value: "deactive", label: "Deactive" },
            ]}
          />

          <Select
            label="Verification"
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value as any)}
            options={[
              { value: "all", label: "All" },
              { value: "verified", label: "Verified" },
              { value: "unverified", label: "Unverified" },
            ]}
          />

          <Select
            label="Approval"
            value={approvedFilter}
            onChange={(e) => setApprovedFilter(e.target.value as any)}
            options={[
              { value: "all", label: "All" },
              { value: "approved", label: "Approved" },
              { value: "unapproved", label: "Unapproved" },
            ]}
          />
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between pt-2 " style={{ borderColor: colors.lightgray }}>
          <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
            Showing <span className="font-semibold">{filteredSellers.length}</span> of{" "}
            <span className="font-semibold">{sellers.length}</span> sellers
          </p>
          {(searchTerm || statusFilter !== "all" || verifiedFilter !== "all" || approvedFilter !== "all") && (
            <Button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setVerifiedFilter("all");
                setApprovedFilter("all");
              }}
              variant="outline"
              size="sm"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Sellers Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: colors.white }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="animate-spin" size={32} style={{ color: colors.primeGreen }} />
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-16">
            <FaStore size={48} style={{ color: colors.lightgray }} className="mx-auto mb-4" />
            <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
              {searchTerm || statusFilter !== "all" || verifiedFilter !== "all" || approvedFilter !== "all"
                ? "No sellers found matching your filters"
                : "No sellers registered yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.lightgray }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: colors.black }}>
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: colors.black }}>
                    Shop Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: colors.black }}>
                    Owner
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: colors.black }}>
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: colors.black }}>
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: colors.black }}>
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: colors.black }}>
                    Verified
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: colors.black }}>
                    Approved
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: colors.black }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map((seller, index) => (
                  <tr
                    key={seller.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                    style={{ borderColor: colors.lightgray }}
                  >
                    <td className="px-4 py-3 font-poppins text-sm" style={{ color: colors.black }}>
                      {seller.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FaStore style={{ color: colors.primeGold }} />
                        <span className="font-poppins text-sm font-medium" style={{ color: colors.black }}>
                          {seller.shopName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-poppins text-sm" style={{ color: colors.black }}>
                      {seller.sellerName}
                    </td>
                    <td className="px-4 py-3 font-poppins text-sm" style={{ color: colors.darkgray }}>
                      {seller.email}
                    </td>
                    <td className="px-4 py-3 font-poppins text-sm" style={{ color: colors.darkgray }}>
                      {seller.contactNumber}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          backgroundColor: getStatusBgColor(seller.status),
                          color: getStatusColor(seller.status),
                        }}
                      >
                        {seller.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {seller.isVerified ? (
                        <FaCheckCircle style={{ color: "#22c55e" }} className="mx-auto" />
                      ) : (
                        <FaTimesCircle style={{ color: "#ef4444" }} className="mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {seller.isApproved ? (
                        <FaCheckCircle style={{ color: "#22c55e" }} className="mx-auto" />
                      ) : (
                        <FaTimesCircle style={{ color: "#ef4444" }} className="mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(seller)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <FaEye style={{ color: colors.primeGreen }} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(seller)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Update Status"
                        >
                          <FaEdit style={{ color: colors.primeGold }} />
                        </button>
                        <button
                          onClick={() => handleDelete(seller)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Delete Seller"
                        >
                          <FaTrash style={{ color: "#ef4444" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedSeller && (
        <>
          <SellerDetailsModal
            seller={selectedSeller}
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
          />
          <UpdateSellerStatusModal
            sellerId={selectedSeller.id}
            sellerName={selectedSeller.sellerName}
            currentStatus={selectedSeller.status}
            isOpen={statusModalOpen}
            onClose={() => setStatusModalOpen(false)}
            onConfirm={confirmUpdateStatus}
          />
          <DeleteSellerModal
            sellerId={selectedSeller.id}
            sellerName={selectedSeller.sellerName}
            shopName={selectedSeller.shopName}
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />
        </>
      )}
      
      <SearchSellerModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSellerFound={handleSellerFound}
      />
    </div>
  );
}

