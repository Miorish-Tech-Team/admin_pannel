"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import { productApi, Product } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiArrowLeft, FiEdit, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import { ConfirmModal } from "@/components/modals";
import { ProductDetailSkeleton } from "@/components/skeletons/ProductDetailSkeleton";

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getProductById(productId);
      setProduct(data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await productApi.deleteProduct(productId);
      toast.success("Product deleted successfully!");
      router.push("/dashboard/products");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete product";
      toast.error(errorMessage);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <ProductDetailSkeleton/>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
         <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Go back"
        >
          <FiArrowLeft size={24} style={{ color: colors.primeGreen }} />
        </button>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            View Product
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-lg font-poppins" style={{ color: colors.primeRed }}>
            {error || "Product not found"}
          </p>
          <Link href="/dashboard/products">
            <Button variant="primary" size="md" className="mt-4">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Go back"
        >
          <FiArrowLeft size={24} style={{ color: colors.primeGreen }} />
        </button>
          <div>
            <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
              Product Details
            </h1>
            <p className="mt-1 font-poppins text-gray-600">{product.productCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/products/${productId}/edit`}>
            <Button variant="secondary" size="md">
              <FiEdit size={18} />
              Edit
            </Button>
          </Link>
          <Button variant="primary" size="md" onClick={handleDeleteClick}>
            <FiTrash2 size={18} />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-4">
          {/* Cover Image */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold font-poppins mb-3" style={{ color: colors.darkgray }}>
              Cover Image
            </h3>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.coverImageUrl}
                alt={product.productName}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Gallery Images */}
          {product.galleryImageUrls && product.galleryImageUrls.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold font-poppins mb-3" style={{ color: colors.darkgray }}>
                Gallery Images
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {product.galleryImageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image src={url} alt={`Gallery ${index + 1}`} fill sizes="(max-width: 1024px) 50vw, 16vw" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
                  {product.productName}
                </h2>
                <p className="text-lg font-poppins text-gray-600 mt-1">{product.productBrand}</p>
              </div>
              {getStatusBadge(product.status)}
            </div>
            
            <p className="font-poppins text-gray-700">{product.productDescription}</p>
            
            {/* Category and Subcategory */}
            {(product.category || product.subcategory) && (
              <div className="flex gap-4 pt-2">
                {product.category && (
                  <div>
                    <p className="text-sm font-poppins text-gray-500">Category</p>
                    <p className="font-poppins font-semibold" style={{ color: colors.primeGreen }}>
                      {product.category.categoryName}
                    </p>
                  </div>
                )}
                {product.subcategory && (
                  <div>
                    <p className="text-sm font-poppins text-gray-500">Subcategory</p>
                    <p className="font-poppins font-semibold" style={{ color: colors.primeGreen }}>
                      {product.subcategory.subCategoryName}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-poppins text-gray-500">Price</p>
                <p className="text-2xl font-bold font-poppins" style={{ color: colors.primeGreen }}>
                  ₹{product.productPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-poppins text-gray-500">Stock</p>
                <p className="text-2xl font-bold font-poppins" style={{ color: colors.darkgray }}>
                  {product.availableStockQuantity}
                </p>
              </div>
              <div>
                <p className="text-sm font-poppins text-gray-500">Views</p>
                <p className="text-2xl font-bold font-poppins" style={{ color: colors.darkgray }}>
                  {product.productViewCount || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-poppins text-gray-500">Sold</p>
                <p className="text-2xl font-bold font-poppins" style={{ color: colors.darkgray }}>
                  {product.totalSoldCount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold font-poppins mb-4" style={{ color: colors.primeGreen }}>
              Pricing Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.productDiscountPercentage && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Discount %</p>
                  <p className="font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    {product.productDiscountPercentage}%
                  </p>
                </div>
              )}
              {product.productDiscountPrice && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Discount Price</p>
                  <p className="font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    ₹{product.productDiscountPrice.toFixed(2)}
                  </p>
                </div>
              )}
              {product.distributorPurchasePrice && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Distributor Purchase</p>
                  <p className="font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    ₹{product.distributorPurchasePrice.toFixed(2)}
                  </p>
                </div>
              )}
              {product.distributorSellingPrice && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Distributor Selling</p>
                  <p className="font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    ₹{product.distributorSellingPrice.toFixed(2)}
                  </p>
                </div>
              )}
              {product.retailerSellingPrice && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Retailer Selling</p>
                  <p className="font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    ₹{product.retailerSellingPrice.toFixed(2)}
                  </p>
                </div>
              )}
              {product.mrpB2B && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">MRP B2B</p>
                  <p className="font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    ₹{product.mrpB2B.toFixed(2)}
                  </p>
                </div>
              )}
              {product.mrpB2C && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">MRP B2C</p>
                  <p className="font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    ₹{product.mrpB2C.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold font-poppins mb-4" style={{ color: colors.primeGreen }}>
              Product Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.productWeight && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Weight</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.productWeight}</p>
                </div>
              )}
              {product.productDimensions && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Dimensions</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.productDimensions}</p>
                </div>
              )}
              {product.productMaterial && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Material</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.productMaterial}</p>
                </div>
              )}
              {product.waxType && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Wax Type</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.waxType}</p>
                </div>
              )}
              {product.singleOrCombo && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Type</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.singleOrCombo}</p>
                </div>
              )}
              {product.stockKeepingUnit && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">SKU</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.stockKeepingUnit}</p>
                </div>
              )}
              {product.productModelNumber && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Model Number</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.productModelNumber}</p>
                </div>
              )}
              {product.productBestSaleTag && (
                <div>
                  <p className="text-sm font-poppins text-gray-500">Best Sale Tag</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.productBestSaleTag}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags, Sizes, Colors */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {product.productTags && (
              <div>
                <h4 className="text-sm font-semibold font-poppins mb-2" style={{ color: colors.darkgray }}>
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(typeof product.productTags === 'string' 
                    ? product.productTags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                    : product.productTags
                  ).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-poppins"
                      style={{ backgroundColor: `${colors.primeGold}20`, color: colors.primeGold }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.productSizes && (
              <div>
                <h4 className="text-sm font-semibold font-poppins mb-2" style={{ color: colors.darkgray }}>
                  Sizes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(typeof product.productSizes === 'string' 
                    ? product.productSizes.split(',').map((size: string) => size.trim()).filter(Boolean)
                    : product.productSizes
                  ).map((size: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-poppins"
                      style={{ backgroundColor: `${colors.primeGreen}20`, color: colors.primeGreen }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.productColors && (
              <div>
                <h4 className="text-sm font-semibold font-poppins mb-2" style={{ color: colors.darkgray }}>
                  Colors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(typeof product.productColors === 'string' 
                    ? product.productColors.split(',').map((color: string) => color.trim()).filter(Boolean)
                    : product.productColors
                  ).map((color: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-poppins"
                      style={{ backgroundColor: `${colors.secondaryGreen}20`, color: colors.secondaryGreen }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Policies */}
          {(product.productWarrantyInfo || product.productReturnPolicy) && (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
              <h3 className="text-lg font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                Policies
              </h3>
              {product.productWarrantyInfo && (
                <div>
                  <p className="text-sm font-semibold font-poppins text-gray-500">Warranty</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.productWarrantyInfo}</p>
                </div>
              )}
              {product.productReturnPolicy && (
                <div>
                  <p className="text-sm font-semibold font-poppins text-gray-500">Return Policy</p>
                  <p className="font-poppins" style={{ color: colors.darkgray }}>{product.productReturnPolicy}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.productName}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />
    </div>
  );
}
