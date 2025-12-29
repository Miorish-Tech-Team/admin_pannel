"use client";

import React from "react";
import { FaTimes, FaEye, FaUser, FaCalendar, FaImage } from "react-icons/fa";
import { Blog } from "@/store/apis/blog/blogApi";

interface BlogDetailsModalProps {
  blog: Blog | null;
  onClose: () => void;
}

const BlogDetailsModal: React.FC<BlogDetailsModalProps> = ({
  blog,
  onClose,
}) => {
  if (!blog) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">Blog Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Blog Image */}
          {blog.image && (
            <div className="w-full rounded-lg overflow-hidden border border-gray-200">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {blog.title}
            </h3>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-200">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaUser className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="font-semibold text-gray-900">
                  {blog.author?.fullName || blog.author?.email || "Unknown"}
                </p>
              </div>
            </div>

            {/* Views */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <FaEye className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Views</p>
                <p className="font-semibold text-gray-900">{blog.views}</p>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <FaCalendar className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatDate(blog.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Description
            </h4>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {blog.description}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="text-gray-900">{formatDate(blog.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <p className="text-gray-900">{formatDate(blog.updatedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Blog ID</p>
              <p className="text-gray-900">{blog.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Author Email</p>
              <p className="text-gray-900">{blog.author?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsModal;
