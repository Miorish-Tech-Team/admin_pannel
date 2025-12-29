"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import {
  getAllBlogs,
  deleteBlog,
  type Blog,
} from "@/store/apis/blog/blogApi";
import { useToast, Button, Input } from "@/components/atoms";
import AddBlogModal from "@/components/modals/AddBlogModal";
import BlogDetailsModal from "@/components/modals/BlogDetailsModal";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await getAllBlogs(currentPage, itemsPerPage, searchTerm);
      setBlogs(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.log(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBlog(id);
      showToast("Blog deleted successfully", "success");
      setDeleteConfirm(null);
      fetchBlogs();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to delete blog",
        "error"
      );
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditBlog(blog);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditBlog(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchBlogs();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Blog Management
        </h1>
        <p className="text-gray-600">Create, edit, and manage blog posts</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <FaPlus /> Add New Blog
          </Button>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : blogs.length === 0 ? (
            <div className="text-center py-40">
                <p className="text-gray-500 text-lg ">No blogs found</p>
                <p className="text-gray-400 text-sm mt-2">
                Create your first blog post to get started
                </p>
            </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="h-16 w-24 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center">
                            <FaEye className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {blog.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {blog.author?.fullName || blog.author?.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <FaEye className="text-gray-400" />
                          {blog.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewBlog(blog)}
                            className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(blog.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    variant="secondary"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    variant="secondary"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddBlogModal
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          editBlog={editBlog}
        />
      )}

      {/* Blog Details Modal */}
      {viewBlog && (
        <BlogDetailsModal blog={viewBlog} onClose={() => setViewBlog(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
