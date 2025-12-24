"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, useToast } from "@/components/atoms";
import { ConfirmModal } from "@/components/modals";
import { TableSkeleton } from "@/components/skeletons";
import { userManagementApi, User } from "@/store/apis";
import { colors } from "@/utils/color";
import {
  FiFilter,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSearch,
} from "react-icons/fi";

export default function UsersPage() {
  const router = useRouter();
  const toast = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "email" | "id">("name");

  // Delete modal
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, statusFilter, searchQuery]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await userManagementApi.getAllUsers();
      setUsers(response.users);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to fetch users";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((u) => {
        if (searchType === "name") {
          return u.fullName?.toLowerCase().includes(query) || false;
        } else if (searchType === "email") {
          return u.email?.toLowerCase().includes(query) || false;
        } else if (searchType === "id") {
          return u.id.toString().includes(query);
        }
        return true;
      });
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await userManagementApi.deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success(`User "${userToDelete.fullName}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to delete user";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (userId: number, newStatus: "active" | "suspended") => {
    try {
      await userManagementApi.updateUserStatus(userId, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      toast.success(`User status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update user status");
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
        className="px-3 py-1 rounded-full text-sm font-poppins capitalize inline-flex items-center gap-1"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        <Icon size={14} />
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusCounts = () => {
    return {
      all: users.length,
      active: users.filter((u) => u.status === "active").length,
      suspended: users.filter((u) => u.status === "suspended").length,
      deleted: users.filter((u) => u.status === "deleted").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold font-cinzel"
            style={{ color: colors.primeGreen }}
          >
            User Management
          </h1>
          <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
            Manage and monitor all registered users
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setStatusFilter("all")}
          style={{
            border:
              statusFilter === "all"
                ? `2px solid ${colors.primeGreen}`
                : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">All Users</p>
          <p
            className="text-2xl font-bold font-cinzel mt-1"
            style={{ color: colors.primeGreen }}
          >
            {statusCounts.all}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setStatusFilter("active")}
          style={{
            border:
              statusFilter === "active"
                ? `2px solid ${colors.primeGreen}`
                : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">Active</p>
          <p
            className="text-2xl font-bold font-cinzel mt-1"
            style={{ color: colors.primeGreen }}
          >
            {statusCounts.active}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setStatusFilter("suspended")}
          style={{
            border:
              statusFilter === "suspended"
                ? `2px solid ${colors.primeGold}`
                : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">Suspended</p>
          <p
            className="text-2xl font-bold font-cinzel mt-1"
            style={{ color: colors.primeGold }}
          >
            {statusCounts.suspended}
          </p>
        </div>
        
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter size={20} style={{ color: colors.primeGreen }} />
          <h2
            className="text-lg font-semibold font-poppins"
            style={{ color: colors.darkgray }}
          >
            Search & Filter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Type */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: colors.darkgray }}
            >
              Search By
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1"
              style={{ ["--tw-ring-color" as any]: colors.primeGold }}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="id">User ID</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: colors.darkgray }}
            >
              Search Users
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${searchType}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1"
              style={{ ["--tw-ring-color" as any]: colors.primeGold }}
            />
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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm font-poppins text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
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

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={6} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-poppins text-gray-500">
              {users.length === 0 ? "No users found" : "No users match your filters"}
            </p>
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
                    User ID
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
                    Email
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Role
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Joined
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p
                        className="font-medium font-poppins"
                        style={{ color: colors.primeGreen }}
                      >
                        #{user.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="font-medium font-poppins"
                        style={{ color: colors.darkgray }}
                      >
                        {user.fullName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-poppins text-gray-600">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-poppins text-gray-600 capitalize">
                        {user.role}
                      </p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-poppins text-gray-600">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/users/${user.id}`)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} style={{ color: colors.primeGreen }} />
                        </button>
                        {user.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(user.id, "suspended")}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Suspend User"
                          >
                            <FiXCircle size={18} style={{ color: colors.primeGold }} />
                          </button>
                        )}
                        {user.status === "suspended" && (
                          <button
                            onClick={() => handleStatusChange(user.id, "active")}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Activate User"
                          >
                            <FiCheckCircle size={18} style={{ color: colors.primeGreen }} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(user)}
                          disabled={isDeleting}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <FiTrash2 size={18} style={{ color: colors.primeRed }} />
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
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.fullName}"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      />
    </div>
  );
}
