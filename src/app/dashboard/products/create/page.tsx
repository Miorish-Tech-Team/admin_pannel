"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Select } from "@/components/atoms";
import { useToast } from "@/components/atoms";
import { productApi, categoryApi, subcategoryApi, SubCategory } from "@/store/apis";
import { colors as themeColors } from "@/utils/color";
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export default function CreateProductPage() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; categoryName: string }[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);

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
  });

  const [files, setFiles] = useState<{
    coverImage: File | null;
    galleryImages: File[];
  }>({
    coverImage: null,
    galleryImages: [],
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    fetchCategoriesAndSubcategories();
  }, []);

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

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        categoryApi.getAllCategories(),
        subcategoryApi.getAllSubCategories(),
      ]);
      setCategories(categoriesRes.categories.map((c) => ({ id: c.id, categoryName: c.categoryName })));
      setSubcategories(subcategoriesRes.subCategories || []);
    } catch (error: any) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (!selectedFiles) return;

    if (name === "coverImage") {
      setFiles((prev) => ({ ...prev, coverImage: selectedFiles[0] }));
    } else if (name === "galleryImages") {
      const fileArray = Array.from(selectedFiles).slice(0, 5);
      setFiles((prev) => ({ ...prev, galleryImages: fileArray }));
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFiles((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, index) => index !== indexToRemove)
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

    if (!files.coverImage) {
      toast.error("Cover image is required");
      return;
    }

    if (!formData.productName || !formData.productDescription || !formData.productBrand || 
        !formData.productCode || !formData.productPrice || !formData.productSubCategoryId) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        ...formData,
        productPrice: Number(formData.productPrice),
        productSubCategoryId: Number(formData.productSubCategoryId),
        availableStockQuantity: Number(formData.availableStockQuantity) || 0,
        coverImageUrl: files.coverImage,
      };

      if (files.galleryImages.length > 0) {
        payload.galleryImageUrls = files.galleryImages;
      }

      if (formData.productDiscountPercentage) {
        payload.productDiscountPercentage = Number(formData.productDiscountPercentage);
      }
      if (formData.productDiscountPrice) {
        payload.productDiscountPrice = Number(formData.productDiscountPrice);
      }
      if (formData.saleDayleft) {
        payload.saleDayleft = Number(formData.saleDayleft);
      }
      if (formData.distributorPurchasePrice) {
        payload.distributorPurchasePrice = Number(formData.distributorPurchasePrice);
      }
      if (formData.distributorSellingPrice) {
        payload.distributorSellingPrice = Number(formData.distributorSellingPrice);
      }
      if (formData.retailerSellingPrice) {
        payload.retailerSellingPrice = Number(formData.retailerSellingPrice);
      }
      if (formData.mrpB2B) {
        payload.mrpB2B = Number(formData.mrpB2B);
      }
      if (formData.mrpB2C) {
        payload.mrpB2C = Number(formData.mrpB2C);
      }

      if (tags.length > 0) payload.productTags = tags;
      if (sizes.length > 0) payload.productSizes = sizes;
      if (colors.length > 0) payload.productColors = colors;

      const response = await productApi.createProduct(payload);
      toast.success("Product created successfully!");
      router.push("/dashboard/products");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create product";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FiArrowLeft size={24} style={{ color: themeColors.primeGreen }} />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: themeColors.primeGreen }}>
            Create Product
          </h1>
          <p className="mt-2 font-poppins" style={{ color: themeColors.darkgray }}>
            Add a new product to your store
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold font-cinzel" style={{ color: themeColors.primeGreen }}>
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name *"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
            
            <Input
              label="Product Brand *"
              name="productBrand"
              value={formData.productBrand}
              onChange={handleChange}
              placeholder="Enter brand name"
              required
            />
            
            <Input
              label="Product Code *"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              placeholder="Enter product code"
              required
            />
            
            <Input
              label="SKU"
              name="stockKeepingUnit"
              value={formData.stockKeepingUnit}
              onChange={handleChange}
              placeholder="Stock Keeping Unit"
            />
            
            <Input
              label="Model Number"
              name="productModelNumber"
              value={formData.productModelNumber}
              onChange={handleChange}
              placeholder="Model number"
            />
            
            <Input
              label="Best Sale Tag"
              name="productBestSaleTag"
              value={formData.productBestSaleTag}
              onChange={handleChange}
              placeholder="e.g., Best Seller"
            />
          </div>

          <Textarea
            label="Product Description *"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="Enter detailed product description"
            rows={4}
            required
          />
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold font-cinzel" style={{ color: themeColors.primeGreen }}>
            Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category *"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setFormData((prev) => ({ ...prev, productSubCategoryId: "" }));
              }}
              options={[
                { value: "", label: "Select Category" },
                ...categories.map((c) => ({ value: c.id.toString(), label: c.categoryName })),
              ]}
              required
            />
            
            <Select
              label="Subcategory *"
              name="productSubCategoryId"
              value={formData.productSubCategoryId}
              onChange={handleChange}
              options={[
                { value: "", label: "Select Subcategory" },
                ...filteredSubcategories.map((s) => ({ 
                  value: s.id.toString(), 
                  label: s.subCategoryName 
                })),
              ]}
              disabled={!selectedCategoryId}
              required
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold font-cinzel" style={{ color: themeColors.primeGreen }}>
            Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Product Price *"
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
          <h2 className="text-xl font-semibold font-cinzel" style={{ color: themeColors.primeGreen }}>
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
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold font-cinzel" style={{ color: themeColors.primeGreen }}>
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
          <h2 className="text-xl font-semibold font-cinzel" style={{ color: themeColors.primeGreen }}>
            Tags, Sizes & Colors
          </h2>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium font-poppins mb-2" style={{ color: themeColors.darkgray }}>
              Product Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Enter tag and press Enter"
              />
              <Button type="button" variant="secondary" size="md" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm font-poppins flex items-center gap-2"
                  style={{ backgroundColor: `${themeColors.primeGold}20`, color: themeColors.primeGold }}
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium font-poppins mb-2" style={{ color: themeColors.darkgray }}>
              Available Sizes
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSize())}
                placeholder="Enter size and press Enter"
              />
              <Button type="button" variant="secondary" size="md" onClick={handleAddSize}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 rounded-full text-sm font-poppins flex items-center gap-2"
                  style={{ backgroundColor: `${themeColors.primeGreen}20`, color: themeColors.primeGreen }}
                >
                  {size}
                  <button type="button" onClick={() => handleRemoveSize(size)} className="hover:opacity-70">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium font-poppins mb-2" style={{ color: themeColors.darkgray }}>
              Available Colors
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddColor())}
                placeholder="Enter color and press Enter"
              />
              <Button type="button" variant="secondary" size="md" onClick={handleAddColor}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 rounded-full text-sm font-poppins flex items-center gap-2"
                  style={{ backgroundColor: `${themeColors.secondaryGreen}20`, color: themeColors.secondaryGreen }}
                >
                  {color}
                  <button type="button" onClick={() => handleRemoveColor(color)} className="hover:opacity-70">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold font-cinzel" style={{ color: themeColors.primeGreen }}>
            Images & Media
          </h2>
          
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium font-poppins mb-2" style={{ color: themeColors.darkgray }}>
              Cover Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="coverImage"
                required
              />
              <label
                htmlFor="coverImage"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FiUpload size={32} style={{ color: themeColors.primeGold }} />
                <span className="font-poppins" style={{ color: themeColors.darkgray }}>
                  {files.coverImage ? files.coverImage.name : "Click to upload cover image"}
                </span>
              </label>
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium font-poppins mb-2" style={{ color: themeColors.darkgray }}>
              Gallery Images (Max 5)
            </label>
            
            {/* Preview of Selected Images */}
            {files.galleryImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-poppins text-gray-600 mb-2">
                  Selected {files.galleryImages.length} image(s):
                </p>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {files.galleryImages.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                      <Image 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${index + 1}`} 
                        fill 
                        sizes="100px" 
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <FiUpload size={32} style={{ color: themeColors.primeGold }} />
                <span className="font-poppins" style={{ color: themeColors.darkgray }}>
                  {files.galleryImages.length > 0
                    ? "Click to select different images"
                    : "Click to upload gallery images (up to 5)"}
                </span>
                <span className="text-xs text-gray-500 font-poppins">
                  You can select multiple images at once
                </span>
              </label>
            </div>
          </div>

          {/* Video URL */}
          {/* <Input
            label="Product Video URL"
            name="productVideoUrl"
            value={formData.productVideoUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
          /> */}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard/products">
            <Button type="button"  variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="secondary" size="md" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
