"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import { ConfirmModal } from "@/components/modals";
import { TableSkeleton } from "@/components/skeletons";
import { productApi, Product, categoryApi, Category, subcategoryApi, SubCategory } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiX } from "react-icons/fi";
import Image from "next/image";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Bulk delete states
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("");
  
  // Categories and Subcategories
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Get category/subcategory from URL params
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    if (category) {
      setCategoryFilter(category);
      fetchProductsByCategory(category);
    } else if (subcategory) {
      setSubcategoryFilter(subcategory);
      fetchProductsBySubCategory(subcategory);
    } else {
      fetchProducts();
    }
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  }, [products, statusFilter, searchQuery]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getAllProducts();
      setProducts(data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryName: string) => {
    try {
      setIsLoading(true);
      const response = await productApi.getProductsByCategory(categoryName);
      setProducts(response.products);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch products");
      toast.error(`Failed to fetch products for category: ${categoryName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsBySubCategory = async (subCategoryName: string) => {
    try {
      setIsLoading(true);
      const response = await productApi.getProductsBySubCategory(
        subCategoryName
      );
      setProducts(response.products);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch products");
      toast.error(
        `Failed to fetch products for subcategory: ${subCategoryName}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      setCategories(response.categories || []);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCategoryChange = async (categoryName: string) => {
    setCategoryFilter(categoryName);
    setSubcategoryFilter("");
    setSelectedCategoryId(null);
    setSubcategories([]);
    
    if (categoryName) {
      const selectedCategory = categories.find(c => c.categoryName === categoryName);
      if (selectedCategory) {
        setSelectedCategoryId(selectedCategory.id);
        try {
          const categoryData = await categoryApi.getCategoryById(selectedCategory.id);
          setSubcategories(categoryData.subcategories || []);
        } catch (error: any) {
          console.error("Failed to fetch subcategories:", error);
        }
      }
      fetchProductsByCategory(categoryName);
    } else {
      fetchProducts();
    }
  };

  const handleSubcategoryChange = (subcategoryName: string) => {
    setSubcategoryFilter(subcategoryName);
    if (subcategoryName) {
      fetchProductsBySubCategory(subcategoryName);
    } else if (categoryFilter) {
      fetchProductsByCategory(categoryFilter);
    } else {
      fetchProducts();
    }
  };

  const clearFilters = () => {
    setCategoryFilter("");
    setSubcategoryFilter("");
    setSelectedCategoryId(null);
    setSubcategories([]);
    router.push("/dashboard/products");
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
          p.productCode.toLowerCase().includes(query) ||
          p.productBrand.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await productApi.deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success(
        `Product "${productToDelete.productName}" deleted successfully!`
      );
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedProducts.length === 0) {
      toast.warning("Please select products to delete");
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const response = await productApi.bulkDeleteProducts(selectedProducts);
      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p.id))
      );
      toast.success(
        `Successfully deleted ${response.deletedCount} product(s)!`
      );
      setSelectedProducts([]);
      setIsBulkDeleteModalOpen(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete products";
      toast.error(errorMessage);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: { bg: `${colors.primeGreen}20`, text: colors.primeGreen },
      pending: { bg: `${colors.primeGold}20`, text: colors.primeGold },
      rejected: { bg: `${colors.primeRed}20`, text: colors.primeRed },
    };
    const style = styles[status as keyof typeof styles] || styles.pending;

    return (
      <span
        className="px-3 py-1 rounded-full text-sm font-poppins capitalize"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {status}
      </span>
    );
  };

  const getStockBadge = (stock: number) => {
    const isLowStock = stock < 10;
    return (
      <span
        className="px-3 py-1 rounded-full text-sm font-poppins"
        style={{
          backgroundColor: isLowStock
            ? `${colors.primeRed}20`
            : `${colors.secondaryGreen}20`,
          color: isLowStock ? colors.primeRed : colors.secondaryGreen,
        }}
      >
        {stock}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold font-cinzel"
            style={{ color: colors.primeGreen }}
          >
            Products
            {categoryFilter && (
              <span
                className="text-xl font-poppins ml-3"
                style={{ color: colors.darkgray }}
              >
                - Category: {categoryFilter}
              </span>
            )}
            {subcategoryFilter && (
              <span
                className="text-xl font-poppins ml-3"
                style={{ color: colors.darkgray }}
              >
                - Subcategory: {subcategoryFilter}
              </span>
            )}
          </h1>
          <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
            Manage all products in your store
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(categoryFilter || subcategoryFilter) && (
            <Button variant="secondary" size="md" onClick={clearFilters}>
              <FiX size={18} />
              Clear Filter
            </Button>
          )}
          {selectedProducts.length > 0 && (
            <Button
              variant="primary"
              size="md"
              onClick={handleBulkDeleteClick}
              style={{ backgroundColor: colors.primeRed }}
            >
              <FiTrash2 size={18} />
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
          <Link href="/dashboard/products/create">
            <Button variant="primary" size="md">
              <FiPlus size={20} />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter size={20} style={{ color: colors.primeGreen }} />
          <h2
            className="text-lg font-semibold font-poppins"
            style={{ color: colors.darkgray }}
          >
            Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: colors.darkgray }}
            >
              Search Products
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, code, or brand..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1"
              style={{ ["--tw-ring-color" as any]: colors.primeGold }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: colors.darkgray }}
            >
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1"
              style={{ ["--tw-ring-color" as any]: colors.primeGold }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: colors.darkgray }}
            >
              Subcategory
            </label>
            <select
              value={subcategoryFilter}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              disabled={!categoryFilter || subcategories.length === 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ ["--tw-ring-color" as any]: colors.primeGold }}
            >
              <option value="">All Subcategories</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.subCategoryName}>
                  {subcategory.subCategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: colors.darkgray }}
            >
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1"
              style={{ ["--tw-ring-color" as any]: colors.primeGold }}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-poppins text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {selectedProducts.length > 0 && (
            <p
              className="text-sm font-poppins font-semibold"
              style={{ color: colors.primeGreen }}
            >
              {selectedProducts.length} selected
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="p-4 rounded-lg font-poppins"
          style={{
            backgroundColor: `${colors.primeRed}20`,
            color: colors.primeRed,
          }}
        >
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={7} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-poppins text-gray-500">
              {products.length === 0
                ? "No products found"
                : "No products match your filters"}
            </p>
            {products.length === 0 && (
              <div className="flex items-center justify-center mt-4">
                <Link href="/dashboard/products/create">
                  <Button variant="secondary" size="md" className="mt-4">
                    Create First Product
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.base }}>
                <tr>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: colors.primeGreen }}
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Image
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Code
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Price
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Stock
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-right text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: colors.primeGreen }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={product.coverImageUrl}
                          alt={product.productName}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="font-medium font-poppins"
                        style={{ color: colors.darkgray }}
                      >
                        {product.productName}
                      </p>
                      <p className="text-sm font-poppins text-gray-500">
                        {product.productBrand}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-poppins text-gray-600">
                        {product.productCode}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {/* The Actual Price to be paid */}
                      <p
                        className="font-medium font-poppins"
                        style={{ color: colors.primeGreen }}
                      >
                        ₹{(product.productDiscountPrice || product.productPrice).toFixed(2)}
                      </p>

                      {/* Show Original Price only if it's different from Discount Price */}
                      {product.productDiscountPrice && product.productPrice > product.productDiscountPrice && (
                        <p className="text-sm font-poppins text-gray-400 line-through">
                          ₹{product.productPrice.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStockBadge(product.availableStockQuantity)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/products/${product.id}`)
                          }
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View"
                        >
                          <FiEye
                            size={18}
                            style={{ color: colors.primeGreen }}
                          />
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/products/${product.id}/edit`
                            )
                          }
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit
                            size={18}
                            style={{ color: colors.primeGold }}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          disabled={isDeleting}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <FiTrash2
                            size={18}
                            style={{ color: colors.primeRed }}
                          />
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.productName}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => !isBulkDeleting && setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Multiple Products"
        message={`Are you sure you want to delete ${selectedProducts.length} selected product(s)? This action cannot be undone.`}
        confirmText={`Delete ${selectedProducts.length} Product(s)`}
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isBulkDeleting}
      />
    </div>
  );
}
