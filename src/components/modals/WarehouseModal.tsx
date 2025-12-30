"use client";

import { useEffect, useState } from "react";
import { Button, Input, Select } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import { warehouseApi, Warehouse, CreateWarehousePayload } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiX } from "react-icons/fi";

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse?: Warehouse | null;
  onSaved: () => void;
}

export default function WarehouseModal({
  isOpen,
  onClose,
  warehouse,
  onSaved,
}: WarehouseModalProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateWarehousePayload>({
    warehouseName: "",
    countryName: "",
    contactNumber: "",
    pinCode: "",
    state: "",
    district: "",
    city: "",
    addressLine: "",
    latitude: undefined,
    longitude: undefined,
    isPrimary: false,
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouseName: warehouse.warehouseName,
        countryName: warehouse.countryName,
        contactNumber: warehouse.contactNumber || "",
        pinCode: warehouse.pinCode,
        state: warehouse.state,
        district: warehouse.district,
        city: warehouse.city,
        addressLine: warehouse.addressLine,
        latitude: warehouse.latitude || undefined,
        longitude: warehouse.longitude || undefined,
        isPrimary: warehouse.isPrimary,
      });
    } else {
      setFormData({
        warehouseName: "",
        countryName: "India",
        contactNumber: "",
        pinCode: "",
        state: "",
        district: "",
        city: "",
        addressLine: "",
        latitude: undefined,
        longitude: undefined,
        isPrimary: false,
      });
    }
    setErrors({});
  }, [warehouse, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "latitude" || name === "longitude") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.warehouseName.trim()) {
      newErrors.warehouseName = "Warehouse name is required";
    }
    if (!formData.countryName.trim()) {
      newErrors.countryName = "Country name is required";
    }
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN code must be 6 digits";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
    }
    if (formData.contactNumber && !/^\+?\d{10,15}$/.test(formData.contactNumber.replace(/[\s-]/g, ""))) {
      newErrors.contactNumber = "Invalid contact number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      if (warehouse) {
        // Update existing warehouse
        await warehouseApi.updateWarehouse(warehouse.id, formData);
        toast.success("Warehouse updated successfully!");
      } else {
        // Create new warehouse
        await warehouseApi.createWarehouse(formData);
        toast.success("Warehouse created successfully!");
      }
      onSaved();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${warehouse ? "update" : "create"} warehouse`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.white }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b z-10"
          style={{ backgroundColor: colors.white, borderColor: colors.lightgray }}
        >
          <h2 className="text-2xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            {warehouse ? "Edit Warehouse" : "Add New Warehouse"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
            style={{ backgroundColor: colors.lightgray }}
            disabled={isSubmitting}
          >
            <FiX size={24} style={{ color: colors.darkgray }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Warehouse Name */}
            <div className="md:col-span-2">
              <Input
                label="Warehouse Name *"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleChange}
                error={errors.warehouseName}
                placeholder="e.g., Main Distribution Center"
              />
            </div>

            {/* Country */}
            <Input
              label="Country *"
              name="countryName"
              value={formData.countryName}
              onChange={handleChange}
              error={errors.countryName}
              placeholder="e.g., India"
            />

            {/* Contact Number */}
            <Input
              label="Contact Number"
              name="contactNumber"
              type="tel"
              value={formData.contactNumber}
              onChange={handleChange}
              error={errors.contactNumber}
              placeholder="e.g., +91 9876543210"
            />

            {/* State */}
            <Input
              label="State *"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              placeholder="e.g., Maharashtra"
            />

            {/* District */}
            <Input
              label="District *"
              name="district"
              value={formData.district}
              onChange={handleChange}
              error={errors.district}
              placeholder="e.g., Mumbai"
            />

            {/* City */}
            <Input
              label="City *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              placeholder="e.g., Andheri"
            />

            {/* PIN Code */}
            <Input
              label="PIN Code *"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              error={errors.pinCode}
              placeholder="e.g., 400001"
              maxLength={6}
            />

            {/* Address Line */}
            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium font-poppins mb-1.5"
                style={{ color: colors.darkgray }}
              >
                Address Line *
              </label>
              <textarea
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg font-poppins text-base transition-all duration-200 focus:outline-none focus:ring-1 resize-none"
                style={{
                  borderColor: errors.addressLine ? colors.primeRed : "#D1D5DB",
                  ["--tw-ring-color" as any]: errors.addressLine
                    ? colors.primeRed
                    : colors.primeGold,
                }}
                placeholder="Enter complete address"
              />
              {errors.addressLine && (
                <p className="mt-1 text-sm font-poppins" style={{ color: colors.primeRed }}>
                  {errors.addressLine}
                </p>
              )}
            </div>

            {/* Latitude */}
            <Input
              label="Latitude (Optional)"
              name="latitude"
              type="number"
              step="0.0000001"
              value={formData.latitude || ""}
              onChange={handleChange}
              placeholder="e.g., 19.0760"
            />

            {/* Longitude */}
            <Input
              label="Longitude (Optional)"
              name="longitude"
              type="number"
              step="0.0000001"
              value={formData.longitude || ""}
              onChange={handleChange}
              placeholder="e.g., 72.8777"
            />

            {/* Is Primary */}
            <div className="md:col-span-2 flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: colors.offYellow }}>
              <input
                type="checkbox"
                id="isPrimary"
                name="isPrimary"
                checked={formData.isPrimary}
                onChange={handleChange}
                className="w-5 h-5 rounded"
                style={{ accentColor: colors.primeGold }}
              />
              <label
                htmlFor="isPrimary"
                className="font-poppins font-medium cursor-pointer"
                style={{ color: colors.primeGreen }}
              >
                Set as Primary Warehouse
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: colors.lightgray }}>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {warehouse ? "Update Warehouse" : "Create Warehouse"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
