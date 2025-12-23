"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, useToast } from "@/components/atoms";
import { ConfirmModal } from "@/components/modals";
import { userManagementApi, User } from "@/store/apis";
import { colors } from "@/utils/color";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShoppingBag,
  FiStar,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrash2,
} from "react-icons/fi";
import { UserDetailSkeleton } from "@/components/skeletons/UserDetailSkeleton";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const userId = Number(params.id);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await userManagementApi.getUserById(userId);
      setUser(response.user);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch user");
      toast.error("Failed to fetch user details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: "active" | "suspended") => {
    if (!user) return;

    try {
      setIsUpdating(true);
      await userManagementApi.updateUserStatus(userId, { status: newStatus });
      setUser({ ...user, status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await userManagementApi.deleteUser(userId);
      toast.success("User deleted successfully");
      router.push("/dashboard/users");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete user");
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { bg: `${colors.primeGreen}20`, text: colors.primeGreen, icon: FiCheckCircle },
      suspended: { bg: `${colors.primeGold}20`, text: colors.primeGold, icon: FiAlertCircle },
      deleted: { bg: `${colors.primeRed}20`, text: colors.primeRed, icon: FiXCircle },
    };
    const style = styles[status as keyof typeof styles] || styles.active;
    const Icon = style.icon;

    return (
      <span
        className="px-4 py-2 rounded-full text-sm font-poppins capitalize inline-flex items-center gap-2"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        <Icon size={16} />
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <UserDetailSkeleton/>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiArrowLeft size={24} style={{ color: colors.primeGreen }} />
            </button>
          </Link>
          <h1
            className="text-3xl font-bold font-cinzel"
            style={{ color: colors.primeGreen }}
          >
            User Details
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-lg font-poppins" style={{ color: colors.primeRed }}>
            {error || "User not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiArrowLeft size={24} style={{ color: colors.primeGreen }} />
            </button>
          </Link>
          <div>
            <h1
              className="text-3xl font-bold font-cinzel"
              style={{ color: colors.primeGreen }}
            >
              {user.fullName}
            </h1>
            <p className="mt-1 font-poppins text-gray-600">User ID: #{user.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(user.status)}
          {user.status === "active" && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleStatusChange("suspended")}
              disabled={isUpdating}
            >
              <FiXCircle size={18} />
              Suspend User
            </Button>
          )}
          {user.status === "suspended" && (
            <Button
              variant="primary"
              size="md"
              onClick={() => handleStatusChange("active")}
              disabled={isUpdating}
            >
              <FiCheckCircle size={18} />
              Activate User
            </Button>
          )}
          <Button
            variant="secondary"
            size="md"
            onClick={handleDeleteClick}
            style={{ backgroundColor: colors.primeRed, color: "white" }}
          >
            <FiTrash2 size={18} />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2
              className="text-xl font-semibold font-cinzel mb-4"
              style={{ color: colors.darkgray }}
            >
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FiUser size={20} style={{ color: colors.primeGreen }} />
                <div>
                  <p className="text-xs font-poppins text-gray-500">Full Name</p>
                  <p className="font-poppins text-gray-700">{user.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMail size={20} style={{ color: colors.primeGreen }} />
                <div>
                  <p className="text-xs font-poppins text-gray-500">Email</p>
                  <p className="font-poppins text-gray-700">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <FiPhone size={20} style={{ color: colors.primeGreen }} />
                  <div>
                    <p className="text-xs font-poppins text-gray-500">Phone</p>
                    <p className="font-poppins text-gray-700">{user.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <FiCalendar size={20} style={{ color: colors.primeGreen }} />
                <div>
                  <p className="text-xs font-poppins text-gray-500">Joined</p>
                  <p className="font-poppins text-gray-700">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiUser size={20} style={{ color: colors.primeGreen }} />
                <div>
                  <p className="text-xs font-poppins text-gray-500">Auth Provider</p>
                  <p className="font-poppins text-gray-700 capitalize">
                    {user.authProvider}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiCheckCircle size={20} style={{ color: colors.primeGreen }} />
                <div>
                  <p className="text-xs font-poppins text-gray-500">Verified</p>
                  <p className="font-poppins text-gray-700">
                    {user.isVerified ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders */}
          {user.orders && user.orders.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiShoppingBag size={20} style={{ color: colors.primeGreen }} />
                <h3
                  className="text-lg font-semibold font-cinzel"
                  style={{ color: colors.darkgray }}
                >
                  Orders ({user.orders.length})
                </h3>
              </div>
              <div className="space-y-3">
                {user.orders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="font-medium font-poppins"
                          style={{ color: colors.primeGreen }}
                        >
                          Order #{order.id}
                        </p>
                        <p className="text-sm font-poppins text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-poppins font-semibold text-gray-700">
                          ₹{order.totalAmount?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-sm font-poppins text-gray-600 capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {user.orders.length > 5 && (
                  <p className="text-sm font-poppins text-gray-500 text-center">
                    And {user.orders.length - 5} more orders...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Reviews */}
          {user.reviews && user.reviews.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiStar size={20} style={{ color: colors.primeGreen }} />
                <h3
                  className="text-lg font-semibold font-cinzel"
                  style={{ color: colors.darkgray }}
                >
                  Reviews ({user.reviews.length})
                </h3>
              </div>
              <div className="space-y-3">
                {user.reviews.slice(0, 5).map((review: any) => (
                  <div
                    key={review.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={14}
                            fill={i < review.rating ? colors.primeGold : "none"}
                            style={{ color: colors.primeGold }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-poppins text-gray-600">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="font-poppins text-gray-700 text-sm">
                      {review.comment}
                    </p>
                  </div>
                ))}
                {user.reviews.length > 5 && (
                  <p className="text-sm font-poppins text-gray-500 text-center">
                    And {user.reviews.length - 5} more reviews...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3
              className="text-lg font-semibold font-cinzel mb-4"
              style={{ color: colors.darkgray }}
            >
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-poppins text-gray-600">Total Orders</span>
                <span className="font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  {user.orders?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-poppins text-gray-600">Total Reviews</span>
                <span className="font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  {user.reviews?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-poppins text-gray-600">Saved Addresses</span>
                <span className="font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  {user.addresses?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          {user.addresses && user.addresses.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin size={20} style={{ color: colors.primeGreen }} />
                <h3
                  className="text-lg font-semibold font-cinzel"
                  style={{ color: colors.darkgray }}
                >
                  Addresses
                </h3>
              </div>
              <div className="space-y-3">
                {user.addresses.map((address: any) => (
                  <div
                    key={address.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <p className="font-poppins text-sm text-gray-700">
                      {address.addressLine1}
                    </p>
                    {address.addressLine2 && (
                      <p className="font-poppins text-sm text-gray-700">
                        {address.addressLine2}
                      </p>
                    )}
                    <p className="font-poppins text-sm text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="font-poppins text-sm text-gray-600">
                      {address.country}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${user.fullName}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete User"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />
    </div>
  );
}
