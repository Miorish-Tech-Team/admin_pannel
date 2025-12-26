"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Textarea, Select } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import {
  productApi,
  categoryApi,
  subcategoryApi,
  SubCategory,
  Product,
  Category,
} from "@/store/apis";
import { colors as themeColors } from "@/utils/color";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { EditProductSkeleton } from "@/components/skeletons/EditProductSkeleton";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const productId = Number(params.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productBrand: "",
    productCode: "",
    productPrice: "",
    productSubCategoryId: "",
    availableStockQuantity: "",
    productDiscountPercentage: "",
    productDiscountPrice: "",
    stockKeepingUnit: "",
    productModelNumber: "",
    productBestSaleTag: "",
    saleDayleft: "",
    productWeight: "",
    productDimensions: "",
    productMaterial: "",
    productWarrantyInfo: "",
    productReturnPolicy: "",
    productVideoUrl: "",
    waxType: "",
    singleOrCombo: "Single",
    distributorPurchasePrice: "",
    distributorSellingPrice: "",
    retailerSellingPrice: "",
    mrpB2B: "",
    mrpB2C: "",
    status: "pending" as "pending" | "approved" | "rejected",
  });

  const [files, setFiles] = useState<{
    coverImage: File | null;
    galleryImages: File[];
  }>({
    coverImage: null,
    galleryImages: [],
  });

  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    fetchData();
  }, [productId]);

  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryId === Number(selectedCategoryId)
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategoryId, subcategories]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productData, categoriesRes, subcategoriesRes] = await Promise.all([
        productApi.getProductById(productId),
        categoryApi.getAllCategories(),
        subcategoryApi.getAllSubCategories(),
      ]);

      setProduct(productData);
      setCategories(categoriesRes.categories);
      setSubcategories(subcategoriesRes.subCategories || []);

      // Populate form with existing data
      setFormData({
        productName: productData.productName || "",
        productDescription: productData.productDescription || "",
        productBrand: productData.productBrand || "",
        productCode: productData.productCode || "",
        productPrice: productData.productPrice?.toString() || "",
        productSubCategoryId:
          productData.productSubCategoryId?.toString() || "",
        availableStockQuantity:
          productData.availableStockQuantity?.toString() || "",
        productDiscountPercentage:
          productData.productDiscountPercentage?.toString() || "",
        productDiscountPrice:
          productData.productDiscountPrice?.toString() || "",
        stockKeepingUnit: productData.stockKeepingUnit || "",
        productModelNumber: productData.productModelNumber || "",
        productBestSaleTag: productData.productBestSaleTag || "",
        saleDayleft: productData.saleDayleft?.toString() || "",
        productWeight: productData.productWeight || "",
        productDimensions: productData.productDimensions || "",
        productMaterial: productData.productMaterial || "",
        productWarrantyInfo: productData.productWarrantyInfo || "",
        productReturnPolicy: productData.productReturnPolicy || "",
        productVideoUrl: productData.productVideoUrl || "",
        waxType: productData.waxType || "",
        singleOrCombo: productData.singleOrCombo || "Single",
        distributorPurchasePrice:
          productData.distributorPurchasePrice?.toString() || "",
        distributorSellingPrice:
          productData.distributorSellingPrice?.toString() || "",
        retailerSellingPrice:
          productData.retailerSellingPrice?.toString() || "",
        mrpB2B: productData.mrpB2B?.toString() || "",
        mrpB2C: productData.mrpB2C?.toString() || "",
        status: productData.status || "pending",
      });

      setTags(
        typeof productData.productTags === "string"
          ? productData.productTags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : productData.productTags || []
      );
      setSizes(
        typeof productData.productSizes === "string"
          ? productData.productSizes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : productData.productSizes || []
      );
      setColors(
        typeof productData.productColors === "string"
          ? productData.productColors
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : productData.productColors || []
      );
      setSelectedCategoryId(productData.productCategoryId?.toString() || "");
      setExistingGalleryUrls(productData.galleryImageUrls || []);
    } catch (error: any) {
      toast.error("Failed to fetch product data");
      router.push("/dashboard/products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (!selectedFiles) return;

    if (name === "coverImage") {
      setFiles((prev) => ({ ...prev, coverImage: selectedFiles[0] }));
    } else if (name === "galleryImages") {
      const currentTotal =
        existingGalleryUrls.length + files.galleryImages.length;
      const remainingSlots = 5 - currentTotal;

      if (remainingSlots <= 0) {
        toast.warning(
          "Maximum 5 gallery images allowed. Remove some existing images first."
        );
        return;
      }

      const newFiles = Array.from(selectedFiles).slice(0, remainingSlots);
      setFiles((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newFiles],
      }));

      if (selectedFiles.length > remainingSlots) {
        toast.info(
          `Only ${remainingSlots} image(s) added. Maximum is 5 total.`
        );
      }
    }
  };

  const handleRemoveExistingGalleryImage = (indexToRemove: number) => {
    setExistingGalleryUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveNewGalleryImage = (indexToRemove: number) => {
    setFiles((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const handleRemoveColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        productBrand: formData.productBrand,
        productCode: formData.productCode,
        productPrice: Number(formData.productPrice),
        productSubCategoryId: Number(formData.productSubCategoryId),
        availableStockQuantity: Number(formData.availableStockQuantity),
        status: formData.status,
      };

      // Add optional fields
      if (formData.productDiscountPercentage)
        payload.productDiscountPercentage = Number(
          formData.productDiscountPercentage
        );
      if (formData.productDiscountPrice)
        payload.productDiscountPrice = Number(formData.productDiscountPrice);
      if (formData.stockKeepingUnit)
        payload.stockKeepingUnit = formData.stockKeepingUnit;
      if (formData.productModelNumber)
        payload.productModelNumber = formData.productModelNumber;
      if (formData.productBestSaleTag)
        payload.productBestSaleTag = formData.productBestSaleTag;
      if (formData.saleDayleft)
        payload.saleDayleft = Number(formData.saleDayleft);
      if (formData.productWeight)
        payload.productWeight = formData.productWeight;
      if (formData.productDimensions)
        payload.productDimensions = formData.productDimensions;
      if (formData.productMaterial)
        payload.productMaterial = formData.productMaterial;
      if (formData.productWarrantyInfo)
        payload.productWarrantyInfo = formData.productWarrantyInfo;
      if (formData.productReturnPolicy)
        payload.productReturnPolicy = formData.productReturnPolicy;
      if (formData.productVideoUrl)
        payload.productVideoUrl = formData.productVideoUrl;
      if (formData.waxType) payload.waxType = formData.waxType;
      if (formData.singleOrCombo)
        payload.singleOrCombo = formData.singleOrCombo;
      if (formData.distributorPurchasePrice)
        payload.distributorPurchasePrice = Number(
          formData.distributorPurchasePrice
        );
      if (formData.distributorSellingPrice)
        payload.distributorSellingPrice = Number(
          formData.distributorSellingPrice
        );
      if (formData.retailerSellingPrice)
        payload.retailerSellingPrice = Number(formData.retailerSellingPrice);
      if (formData.mrpB2B) payload.mrpB2B = Number(formData.mrpB2B);
      if (formData.mrpB2C) payload.mrpB2C = Number(formData.mrpB2C);

      // Add arrays
      if (tags.length > 0) payload.productTags = tags;
      if (sizes.length > 0) payload.productSizes = sizes;
      if (colors.length > 0) payload.productColors = colors;

      // Add existing gallery URLs (as JSON string) and new files
      if (existingGalleryUrls.length > 0) {
        payload.existingGalleryUrls = JSON.stringify(existingGalleryUrls);
      }
      if (files.galleryImages.length > 0) {
        payload.galleryImageUrls = files.galleryImages;
      }

      await productApi.updateProduct(productId, payload);
      toast.success("Product updated successfully!");
      router.push(`/dashboard/products/${productId}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update product";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <EditProductSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Go back"
        >
          <FiArrowLeft size={24} style={{ color: themeColors.primeGreen }} />
        </button>
        <div>
          <h1
            className="text-3xl font-bold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Edit Product
          </h1>
          <p className="mt-1 font-poppins text-gray-600">
            Update product information
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2
            className="text-xl font-semibold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Basic Information
          </h2>

          <Input
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />

          <Textarea
            label="Product Description"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="Describe your product"
            rows={4}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Brand"
              name="productBrand"
              value={formData.productBrand}
              onChange={handleChange}
              placeholder="Brand name"
              required
            />

            <Input
              label="Product Code"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              placeholder="e.g., SKU-001"
              required
            />

            <Input
              label="SKU"
              name="stockKeepingUnit"
              value={formData.stockKeepingUnit}
              onChange={handleChange}
              placeholder="Stock keeping unit"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Model Number"
              name="productModelNumber"
              value={formData.productModelNumber}
              onChange={handleChange}
              placeholder="Product model"
            />

            <Input
              label="Best Sale Tag"
              name="productBestSaleTag"
              value={formData.productBestSaleTag}
              onChange={handleChange}
              placeholder="e.g., Hot Deal"
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2
            className="text-xl font-semibold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Category & Subcategory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setFormData((prev) => ({ ...prev, productSubCategoryId: "" }));
              }}
              options={[
                { value: "", label: "Select Category" },
                ...categories.map((c) => ({
                  value: c.id.toString(),
                  label: c.categoryName,
                })),
              ]}
              required
            />

            <Select
              label="Subcategory"
              name="productSubCategoryId"
              value={formData.productSubCategoryId}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Subcategory" },
                ...filteredSubcategories.map((s) => ({
                  value: s.id.toString(),
                  label: s.subCategoryName,
                })),
              ]}
              required
              disabled={!selectedCategoryId}
            />
          </div>

          {/* Category Details */}
          {selectedCategoryId &&
            categories.find((c) => c.id === Number(selectedCategoryId)) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3
                  className="text-lg font-semibold font-cinzel mb-4"
                  style={{ color: themeColors.primeGreen }}
                >
                  Selected Category Details
                </h3>
                {(() => {
                  const selectedCat = categories.find(
                    (c) => c.id === Number(selectedCategoryId)
                  );
                  return selectedCat ? (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <p
                        className="font-poppins text-sm"
                        style={{ color: themeColors.darkgray }}
                      >
                        <span className="font-semibold">Category:</span>{" "}
                        {selectedCat.categoryName}
                      </p>
                      {selectedCat.categoryDescription && (
                        <p
                          className="font-poppins text-sm"
                          style={{ color: themeColors.darkgray }}
                        >
                          <span className="font-semibold">Description:</span>{" "}
                          {selectedCat.categoryDescription}
                        </p>
                      )}
                      {selectedCat.categoryImage && (
                        <div className="mt-3">
                          <p
                            className="font-poppins text-sm font-semibold mb-2"
                            style={{ color: themeColors.darkgray }}
                          >
                            Image:
                          </p>
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                              src={selectedCat.categoryImage}
                              alt={selectedCat.categoryName}
                              fill
                              sizes="128px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}

          {/* Subcategory Details */}
          {formData.productSubCategoryId &&
            filteredSubcategories.find(
              (s) => s.id === Number(formData.productSubCategoryId)
            ) && (
              <div className="mt-4">
                <h3
                  className="text-lg font-semibold font-cinzel mb-4"
                  style={{ color: themeColors.primeGreen }}
                >
                  Selected Subcategory Details
                </h3>
                {(() => {
                  const selectedSub = filteredSubcategories.find(
                    (s) => s.id === Number(formData.productSubCategoryId)
                  );
                  return selectedSub ? (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <p
                        className="font-poppins text-sm"
                        style={{ color: themeColors.darkgray }}
                      >
                        <span className="font-semibold">Subcategory:</span>{" "}
                        {selectedSub.subCategoryName}
                      </p>
                      {selectedSub.subCategoryDescription && (
                        <p
                          className="font-poppins text-sm"
                          style={{ color: themeColors.darkgray }}
                        >
                          <span className="font-semibold">Description:</span>{" "}
                          {selectedSub.subCategoryDescription}
                        </p>
                      )}
                      {selectedSub.subCategoryImage && (
                        <div className="mt-3">
                          <p
                            className="font-poppins text-sm font-semibold mb-2"
                            style={{ color: themeColors.darkgray }}
                          >
                            Image:
                          </p>
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                              src={selectedSub.subCategoryImage}
                              alt={selectedSub.subCategoryName}
                              fill
                              sizes="128px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2
            className="text-xl font-semibold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Product Status
          </h2>

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
            required
          />
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2
            className="text-xl font-semibold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Product Price"
              name="productPrice"
              type="number"
              step="0.01"
              value={formData.productPrice}
              onChange={handleChange}
              placeholder="0.00"
              required
            />

            <Input
              label="Discount Percentage"
              name="productDiscountPercentage"
              type="number"
              step="0.01"
              value={formData.productDiscountPercentage}
              onChange={handleChange}
              placeholder="0"
            />

            <Input
              label="Discount Price"
              name="productDiscountPrice"
              type="number"
              step="0.01"
              value={formData.productDiscountPrice}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="Distributor Purchase Price"
              name="distributorPurchasePrice"
              type="number"
              step="0.01"
              value={formData.distributorPurchasePrice}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="Distributor Selling Price"
              name="distributorSellingPrice"
              type="number"
              step="0.01"
              value={formData.distributorSellingPrice}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="Retailer Selling Price"
              name="retailerSellingPrice"
              type="number"
              step="0.01"
              value={formData.retailerSellingPrice}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="MRP B2B"
              name="mrpB2B"
              type="number"
              step="0.01"
              value={formData.mrpB2B}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="MRP B2C"
              name="mrpB2C"
              type="number"
              step="0.01"
              value={formData.mrpB2C}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="Sale Days Left"
              name="saleDayleft"
              type="number"
              value={formData.saleDayleft}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2
            className="text-xl font-semibold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Available Stock Quantity"
              name="availableStockQuantity"
              type="number"
              value={formData.availableStockQuantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2
            className="text-xl font-semibold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Weight"
              name="productWeight"
              value={formData.productWeight}
              onChange={handleChange}
              placeholder="e.g., 500g"
            />

            <Input
              label="Dimensions"
              name="productDimensions"
              value={formData.productDimensions}
              onChange={handleChange}
              placeholder="e.g., 10x10x10 cm"
            />

            <Input
              label="Material"
              name="productMaterial"
              value={formData.productMaterial}
              onChange={handleChange}
              placeholder="e.g., Cotton, Wax"
            />

            <Input
              label="Wax Type"
              name="waxType"
              value={formData.waxType}
              onChange={handleChange}
              placeholder="e.g., Soy Wax"
            />

            <Select
              label="Single or Combo"
              name="singleOrCombo"
              value={formData.singleOrCombo}
              onChange={handleChange}
              options={[
                { value: "Single", label: "Single" },
                { value: "Combo", label: "Combo" },
              ]}
            />
          </div>

          <Input
            label="Warranty Info"
            name="productWarrantyInfo"
            value={formData.productWarrantyInfo}
            onChange={handleChange}
            placeholder="Enter warranty information"
          />

          <Input
            label="Return Policy"
            name="productReturnPolicy"
            value={formData.productReturnPolicy}
            onChange={handleChange}
            placeholder="Enter return policy"
          />
        </div>

        {/* Tags, Sizes, Colors */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2
            className="text-xl font-semibold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Tags, Sizes & Colors
          </h2>

          {/* Tags */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: themeColors.darkgray }}
            >
              Product Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="Enter tag and press Enter"
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm font-poppins flex items-center gap-2"
                  style={{
                    backgroundColor: `${themeColors.primeGold}20`,
                    color: themeColors.primeGold,
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: themeColors.darkgray }}
            >
              Available Sizes
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddSize())
                }
                placeholder="Enter size and press Enter"
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddSize}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 rounded-full text-sm font-poppins flex items-center gap-2"
                  style={{
                    backgroundColor: `${themeColors.primeGreen}20`,
                    color: themeColors.primeGreen,
                  }}
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: themeColors.darkgray }}
            >
              Available Colors
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddColor())
                }
                placeholder="Enter color and press Enter"
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddColor}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 rounded-full text-sm font-poppins flex items-center gap-2"
                  style={{
                    backgroundColor: `${themeColors.secondaryGreen}20`,
                    color: themeColors.secondaryGreen,
                  }}
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2
            className="text-xl font-semibold font-cinzel"
            style={{ color: themeColors.primeGreen }}
          >
            Images & Media
          </h2>

          {/* Current Cover Image (Display Only) */}
          {product?.coverImageUrl && (
            <div>
              <label
                className="block text-sm font-medium font-poppins mb-2"
                style={{ color: themeColors.darkgray }}
              >
                Cover Image (Cannot be changed)
              </label>
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={product.coverImageUrl}
                  alt="Cover image"
                  fill
                  sizes="192px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 font-poppins">
                Cover image can only be set during product creation
              </p>
            </div>
          )}

          {/* Gallery Images */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: themeColors.darkgray }}
            >
              Gallery Images (
              {existingGalleryUrls.length + files.galleryImages.length}/5)
            </label>

            {/* Display All Images: Existing + New */}
            {(existingGalleryUrls.length > 0 ||
              files.galleryImages.length > 0) && (
              <div className="mb-4">
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {/* Existing Gallery Images */}
                  {existingGalleryUrls.map((url, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-500"
                    >
                      <Image
                        src={url}
                        alt={`Existing ${index + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        title="Remove existing image"
                      >
                        <FiX size={14} />
                      </button>
                      <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                        Existing
                      </div>
                    </div>
                  ))}

                  {/* New Gallery Images */}
                  {files.galleryImages.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        title="Remove new image"
                      >
                        <FiX size={14} />
                      </button>
                      <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-green-500 text-white text-xs rounded">
                        New
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-poppins text-gray-600">
                  <span className="text-blue-600">Blue border</span> = Existing
                  images, <span className="text-green-600">Green border</span> =
                  New images to upload
                </p>
              </div>
            )}

            {/* Upload More Button */}
            {existingGalleryUrls.length + files.galleryImages.length < 5 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  name="galleryImages"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="galleryImages"
                />
                <label
                  htmlFor="galleryImages"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FiUpload
                    size={32}
                    style={{ color: themeColors.primeGold }}
                  />
                  <span
                    className="font-poppins"
                    style={{ color: themeColors.darkgray }}
                  >
                    Add more images (
                    {5 -
                      existingGalleryUrls.length -
                      files.galleryImages.length}{" "}
                    slots remaining)
                  </span>
                  <span className="text-xs text-gray-500 font-poppins">
                    You can select multiple images at once
                  </span>
                </label>
              </div>
            )}

            {existingGalleryUrls.length + files.galleryImages.length >= 5 && (
              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm font-poppins text-gray-600">
                  Maximum of 5 gallery images reached. Remove some images to add
                  new ones.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link href={`/dashboard/products/${productId}`}>
            <Button type="button" variant="secondary" size="md">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
