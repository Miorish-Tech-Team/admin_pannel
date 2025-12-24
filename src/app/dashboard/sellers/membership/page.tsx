"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/utils/color";
import { Button, Input, Textarea, Select, useToast } from "@/components/atoms";
import { membershipApi, Membership, MembershipFormData } from "@/store/apis";
import { FaCrown, FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

export default function MembershipManagement() {
  const toast = useToast();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<MembershipFormData>({
    planName: "Basic",
    durationInDays: "30",
    price: 0,
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setIsLoading(true);
      const response = await membershipApi.getAllMemberships();
      if (response.success && response.memberships) {
        setMemberships(Array.isArray(response.memberships) ? response.memberships : []);
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || "Failed to fetch memberships");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (membership?: Membership) => {
    if (membership) {
      setEditingMembership(membership);
      setFormData({
        planName: membership.planName,
        durationInDays: membership.durationInDays,
        price: membership.price,
        description: membership.description,
        isActive: membership.isActive,
      });
    } else {
      setEditingMembership(null);
      setFormData({
        planName: "Basic",
        durationInDays: "30",
        price: 0,
        description: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMembership(null);
    setFormData({
      planName: "Basic",
      durationInDays: "30",
      price: 0,
      description: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (editingMembership) {
        const response = await membershipApi.updateMembership(editingMembership.id, formData);
        toast.success(response.message || "Membership updated successfully");
      } else {
        const response = await membershipApi.createMembership(formData);
        toast.success(response.message || "Membership created successfully");
      }
      handleCloseModal();
      fetchMemberships();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save membership");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (membershipId: number) => {
    if (!confirm("Are you sure you want to delete this membership plan?")) return;

    try {
      const response = await membershipApi.deleteMembership(membershipId);
      toast.success(response.message || "Membership deleted successfully");
      fetchMemberships();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete membership");
    }
  };

  const getDurationLabel = (days: string) => {
    const dayMap: Record<string, string> = {
      "30": "1 Month",
      "90": "3 Months",
      "180": "6 Months",
      "365": "1 Year",
      "730": "2 Years",
    };
    return dayMap[days] || days + " Days";
  };

  if (isLoading) {
    return (
      <div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
            Membership Plans
          </h2>
          <p className="mt-1 font-poppins text-sm" style={{ color: colors.darkgray }}>
            Manage seller membership plans and pricing
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <FaPlus />
          Add New Plan
        </Button>
      </div>

      {/* Membership Cards */}
      {memberships.length === 0 ? (
        <div
          className="text-center flex flex-col items-center py-12 rounded-xl"
          style={{ backgroundColor: colors.white }}
        >
          <FaCrown size={48} style={{ color: colors.primeGold }} className="mx-auto mb-4" />
          <h3 className="text-xl font-cinzel font-bold mb-2" style={{ color: colors.primeGreen }}>
            No Membership Plans
          </h3>
          <p className="font-poppins text-sm mb-4" style={{ color: colors.darkgray }}>
            Create your first membership plan to get started
          </p>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <FaPlus />
            Create Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((membership) => (
            <div
              key={membership.id}
              className="rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ backgroundColor: colors.white }}
            >
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primeGold}20` }}
                  >
                    <FaCrown size={24} style={{ color: colors.primeGold }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-cinzel font-bold" style={{ color: colors.primeGreen }}>
                      {membership.planName}
                    </h3>
                    <p className="text-xs font-poppins" style={{ color: colors.darkgray }}>
                      {getDurationLabel(membership.durationInDays)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-poppins font-medium`}
                  style={{
                    backgroundColor: membership.isActive ? `${colors.secondaryGreen}20` : `${colors.primeRed}20`,
                    color: membership.isActive ? colors.secondaryGreen : colors.primeRed,
                  }}
                >
                  {membership.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-cinzel font-bold" style={{ color: colors.primeGold }}>
                    Rs {membership.price}
                  </span>
                  <span className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                    / {getDurationLabel(membership.durationInDays)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-sm font-poppins mb-4 line-clamp-3"
                style={{ color: colors.darkgray }}
              >
                {membership.description || "No description provided"}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t" style={{ borderColor: colors.offYellow }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(membership)}
                  className="flex-1"
                >
                  <FaEdit />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(membership.id)}
                  className="flex-1"
                >
                  <FaTrash />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: colors.white }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
              style={{ backgroundColor: colors.white, borderColor: colors.offYellow }}
            >
              <h3 className="text-xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
                {editingMembership ? "Edit Membership Plan" : "Create New Membership Plan"}
              </h3>
              <button
                onClick={handleCloseModal}
                disabled={isProcessing}
                className="hover:opacity-70 transition-opacity"
                style={{ color: colors.darkgray }}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Plan Name */}
                <div>
                  <label className="block font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                    Plan Name *
                  </label>
                  <Select
                    value={formData.planName}
                    onChange={(e) => setFormData({ ...formData, planName: e.target.value as any })}
                    options={[
                      { value: "Basic", label: "Basic" },
                      { value: "Standard", label: "Standard" },
                      { value: "Premium", label: "Premium" },
                    ]}
                    required
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                    Duration *
                  </label>
                  <Select
                    value={formData.durationInDays}
                    onChange={(e) => setFormData({ ...formData, durationInDays: e.target.value as any })}
                    options={[
                      { value: "30", label: "1 Month (30 Days)" },
                      { value: "90", label: "3 Months (90 Days)" },
                      { value: "180", label: "6 Months (180 Days)" },
                      { value: "365", label: "1 Year (365 Days)" },
                      { value: "730", label: "2 Years (730 Days)" },
                    ]}
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                  Price (INR) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter price"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter plan description and features..."
                  rows={4}
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                  Active (visible to sellers)
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isProcessing}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {editingMembership ? "Update Plan" : "Create Plan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
