"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import { ConfirmModal } from "@/components/modals";
import { TableSkeleton } from "@/components/skeletons";
import { warehouseApi, Warehouse } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import WarehouseModal from "../../../components/modals/WarehouseModal";
import { WareHouseSkeleton } from "@/components/skeletons/WareHouseSkeleton";

export default function WarehousesPage() {
  const toast = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  
  // Delete modal states
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setIsLoading(true);
      const response = await warehouseApi.getAllWarehouses();
      setWarehouses(response.warehouses);
    } catch (error: any) {
      console.log(error.response?.data?.message || "Failed to fetch warehouses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingWarehouse(null);
    setIsWarehouseModalOpen(true);
  };

  const handleEditClick = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsWarehouseModalOpen(true);
  };

  const handleDeleteClick = (warehouse: Warehouse) => {
    setWarehouseToDelete(warehouse);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!warehouseToDelete) return;

    setIsDeleting(true);
    try {
      await warehouseApi.deleteWarehouse(warehouseToDelete.id);
      setWarehouses((prev) => prev.filter((wh) => wh.id !== warehouseToDelete.id));
      toast.success(`Warehouse "${warehouseToDelete.warehouseName}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setWarehouseToDelete(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete warehouse";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWarehouseSaved = () => {
    fetchWarehouses();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <WareHouseSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 
          className="text-3xl md:text-4xl font-bold mb-2 font-cinzel"
          style={{ color: colors.primeGreen }}
        >
          Warehouse Management
        </h1>
        <p className="font-poppins" style={{ color: colors.darkgray }}>
          Manage your warehouse locations and distribution centers
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="font-poppins" style={{ color: colors.darkgray }}>
          Total Warehouses: <span className="font-semibold">{warehouses.length}</span>
        </div>
        <Button
          onClick={handleAddClick}
          size="md"
          className="flex items-center gap-2"
        >
          <FiPlus size={18} />
          Add New Warehouse
        </Button>
      </div>

      {warehouses.length === 0 ? (
        <div 
          className="text-center flex flex-col items-center py-12 rounded-lg border-2 border-dashed"
          style={{ borderColor: colors.lightgray }}
        >
          <FiMapPin size={48} className="mx-auto mb-4" style={{ color: colors.primeGold }} />
          <h3 className="text-xl font-semibold mb-2 font-cinzel" style={{ color: colors.primeGreen }}>
            No Warehouses Yet
          </h3>
          <p className="mb-4 font-poppins" style={{ color: colors.darkgray }}>
            Start by adding your first warehouse location
          </p>
          <Button onClick={handleAddClick} size="md">
            <FiPlus size={18} />
            Add First Warehouse
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border"
              style={{ 
                backgroundColor: colors.white,
                borderColor: warehouse.isPrimary ? colors.primeGold : colors.lightgray,
                borderWidth: warehouse.isPrimary ? '2px' : '1px'
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold font-cinzel" style={{ color: colors.primeGreen }}>
                      {warehouse.warehouseName}
                    </h3>
                    {warehouse.isPrimary && (
                      <FiStar size={18} className="fill-current" style={{ color: colors.primeGold }} />
                    )}
                  </div>
                  <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                    {warehouse.city}, {warehouse.state}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <FiMapPin size={16} className="mt-1 shrink-0" style={{ color: colors.primeGold }} />
                  <div className="font-poppins text-sm" style={{ color: colors.darkgray }}>
                    <p>{warehouse.addressLine}</p>
                    <p>{warehouse.district}, {warehouse.city}</p>
                    <p>{warehouse.state} - {warehouse.pinCode}</p>
                    <p>{warehouse.countryName}</p>
                  </div>
                </div>
                {warehouse.contactNumber && (
                  <div className="flex items-center gap-2">
                    <FiPhone size={16} style={{ color: colors.primeGold }} />
                    <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
                      {warehouse.contactNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t" style={{ borderColor: colors.lightgray }}>
                <Button
                  onClick={() => handleEditClick(warehouse)}
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <FiEdit size={16} />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteClick(warehouse)}
                  variant="danger"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <FiTrash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warehouse Modal */}
      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={() => {
          setIsWarehouseModalOpen(false);
          setEditingWarehouse(null);
        }}
        warehouse={editingWarehouse}
        onSaved={handleWarehouseSaved}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Warehouse"
        message={`Are you sure you want to delete "${warehouseToDelete?.warehouseName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setWarehouseToDelete(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
}
