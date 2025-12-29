"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaUpload, FaTimes, FaImage } from "react-icons/fa";
import { createBlog, updateBlog, Blog } from "@/store/apis/blog/blogApi";
import { useToast, Button, Input, Textarea } from "@/components/atoms";

interface AddBlogModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editBlog?: Blog | null;
}

const AddBlogModal: React.FC<AddBlogModalProps> = ({
  onClose,
  onSuccess,
  editBlog = null,
}) => {
  const [title, setTitle] = useState(editBlog?.title || "");
  const [description, setDescription] = useState(editBlog?.description || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editBlog?.image || null
  );
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image file", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB", "error");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }

    if (!description.trim()) {
      showToast("Please enter a description", "error");
      return;
    }

    if (!editBlog && !image) {
      showToast("Please select an image", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      
      if (image) {
        formData.append("image", image);
      }

      if (editBlog) {
        await updateBlog(editBlog.id, formData);
        showToast("Blog updated successfully", "success");
      } else {
        await createBlog(formData);
        showToast("Blog created successfully", "success");
      }

      onSuccess();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || `Failed to ${editBlog ? "update" : "create"} blog`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {editBlog ? "Edit Blog" : "Add New Blog"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <Input
              label="Blog Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter blog description"
              rows={6}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image {!editBlog && <span className="text-red-500">*</span>}
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Recommended: 1200x630px | Max size: 5MB
            </p>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <FaUpload className="mx-auto text-gray-400 text-3xl mb-3" />
                <p className="text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? editBlog
                  ? "Updating..."
                  : "Creating..."
                : editBlog
                ? "Update Blog"
                : "Create Blog"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogModal;
