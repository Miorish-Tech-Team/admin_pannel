// Example usage of Toast and ConfirmModal components
// This file demonstrates how to use the toast notifications and confirmation modal

/*
==============================================
STEP 1: Wrap your app with ToastProvider
==============================================

In your root layout file (e.g., app/layout.tsx):

import { ToastProvider } from "@/components/atoms";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}


==============================================
STEP 2: Using Toast Notifications
==============================================

Import the useToast hook in any component:

import { useToast } from "@/components/atoms";

const MyComponent = () => {
  const toast = useToast();

  const handleSuccess = async () => {
    try {
      // Your API call
      const response = await fetch('/api/data', { method: 'POST', ... });
      
      if (response.ok) {
        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/data/123', { method: 'PUT', ... });
      if (response.ok) {
        toast.success("Data updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update data");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/data/123', { method: 'DELETE' });
      if (response.ok) {
        toast.success("Data deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete data");
      }
  };

  return (
    <div>
      <button onClick={handleSuccess}>Save</button>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};


==============================================
STEP 3: Using ConfirmModal for Deletions
==============================================

import { useState } from "react";
import { useToast } from "@/components/atoms";
import { ConfirmModal } from "@/components/modals";

const DeleteComponent = () => {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/items/${itemToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Item deleted successfully!");
        setIsModalOpen(false);
        // Refresh your data here
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete item");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div>
      <button onClick={() => handleDeleteClick("item-123")}>
        Delete Item
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />
    </div>
  );
};


==============================================
COMPLETE EXAMPLE: Category/Subcategory Delete
==============================================

"use client";

import { useState } from "react";
import { useToast } from "@/components/atoms";
import { ConfirmModal } from "@/components/modals";

const CategoryManagement = () => {
  const toast = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteCategory = async (id: string, name: string) => {
    setCategoryToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Category "${categoryToDelete.name}" deleted successfully!`);
        setIsDeleteModalOpen(false);
        // Refresh categories list
      } else {
        // Show specific error message from backend
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCategory = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Category created successfully!");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleUpdateCategory = async (id: string, formData: any) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Category updated successfully!");
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div>
      <button onClick={() => handleDeleteCategory("1", "Electronics")}>
        Delete Electronics
      </button>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and may affect related subcategories and products.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CategoryManagement;


==============================================
ALL TOAST METHODS
==============================================

const toast = useToast();

// Success toast (green)
toast.success("Operation completed successfully!", 5000); // 5 seconds

// Error toast (red)
toast.error("Something went wrong!", 7000); // 7 seconds

// Warning toast (yellow)
toast.warning("Please review your input", 6000); // 6 seconds

// Info toast (blue)
toast.info("New update available", 5000); // 5 seconds

// Generic toast with custom type
toast.showToast("Custom message", "success", 4000);


==============================================
CONFIRM MODAL PROPS
==============================================

<ConfirmModal
  isOpen={boolean}                    // Controls modal visibility
  onClose={() => void}                // Called when modal should close
  onConfirm={() => void}              // Called when user confirms
  title="Confirm Action"              // Modal title (optional)
  message="Are you sure?"             // Modal message (optional)
  confirmText="Confirm"               // Confirm button text (optional)
  cancelText="Cancel"                 // Cancel button text (optional)
  confirmButtonClass="bg-red-600..."  // Custom confirm button style (optional)
  isLoading={boolean}                 // Shows loading state (optional)
/>

*/
