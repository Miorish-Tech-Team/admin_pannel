"use client";

import { useEffect, useState } from "react";
import { colors } from "@/utils/color";
import { FiPackage, FiSearch, FiFilter, FiX, FiEye, FiEdit2, FiCheck, FiMapPin, FiUser, FiShoppingBag } from "react-icons/fi";
import { orderApi, type Order } from "@/store/apis";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  const statusColors: Record<string, string> = {
    Pending: "#FFA500",
    Processing: "#2196F3",
    Shipped: "#9C27B0",
    Delivered: "#04A82A",
    Cancelled: "#FF0008",
  };

  const paymentStatusColors: Record<string, string> = {
    Completed: "#04A82A",
    Pending: "#FFA500",
    Failed: "#FF0008",
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (statusFilter !== "all") {
        params.orderStatus = statusFilter;
      }
      console.log("Fetching orders with params:", params);
      const response = await orderApi.getAllOrders(params);
      console.log("Orders fetched successfully:", response);
      setOrders(response.orders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch orders';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setUpdating(true);
      await orderApi.updateOrderStatus(selectedOrder.id, newStatus);
      
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, orderStatus: newStatus as any }
            : order
        )
      );
      
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.uniqueOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.User?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#FFA500";
      case "Processing":
        return "#2196F3";
      case "Shipped":
        return "#9C27B0";
      case "Delivered":
        return "#04A82A";
      case "Cancelled":
        return "#FF0008";
      default:
        return colors.darkgray;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "#04A82A";
      case "Pending":
        return "#FFA500";
      case "Failed":
        return "#FF0008";
      default:
        return colors.darkgray;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-cinzel mb-2" style={{ color: colors.primeGreen }}>
          Order Management
        </h1>
        <p className="font-poppins" style={{ color: colors.darkgray }}>
          View and manage all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.darkgray }}
              size={20}
            />
            <input
              type="text"
              placeholder="Search by Order ID, Email, Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg font-poppins"
              style={{ borderColor: colors.lightgray }}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FiFilter
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.darkgray }}
              size={20}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg font-poppins appearance-none cursor-pointer"
              style={{ borderColor: colors.lightgray }}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => {
          const count = orders.filter((o) => o.orderStatus === status).length;
          return (
            <div
              key={status}
              className="bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setStatusFilter(status)}
            >
              <div
                className="text-2xl font-bold font-cinzel mb-1"
                style={{ color: getStatusColor(status) }}
              >
                {count}
              </div>
              <div className="text-sm font-poppins" style={{ color: colors.darkgray }}>
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiX size={20} style={{ color: colors.primeRed }} />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium" style={{ color: colors.primeRed }}>
                  Error Loading Orders
                </h3>
                <p className="mt-1 text-sm" style={{ color: colors.primeRed }}>
                  {error}
                </p>
                <button
                  onClick={fetchOrders}
                  className="mt-2 text-sm underline font-poppins"
                  style={{ color: colors.primeRed }}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.base }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  Date
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold font-poppins" style={{ color: colors.primeGreen }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.primeGreen }}></div>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FiPackage size={48} style={{ color: colors.lightgray }} className="mb-3" />
                      <p className="font-poppins" style={{ color: colors.darkgray }}>
                        No orders found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold" style={{ color: colors.primeGreen }}>
                        {order.uniqueOrderId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-poppins text-sm font-medium" style={{ color: colors.darkgray }}>
                          {order.User?.fullName}
                        </div>
                        <div className="font-poppins text-xs" style={{ color: colors.lightgray }}>
                          {order.User?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-poppins text-sm font-semibold" style={{ color: colors.primeGreen }}>
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span
                          className="inline-block px-2 py-1 rounded text-xs font-poppins font-medium"
                          style={{
                            backgroundColor: `${getPaymentStatusColor(order.paymentStatus)}20`,
                            color: getPaymentStatusColor(order.paymentStatus),
                          }}
                        >
                          {order.paymentStatus}
                        </span>
                        <div className="text-xs mt-1 font-poppins" style={{ color: colors.darkgray }}>
                          {order.paymentMethod}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-poppins font-medium"
                        style={{
                          backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                          color: getStatusColor(order.orderStatus),
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-poppins text-sm" style={{ color: colors.darkgray }}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 rounded hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} style={{ color: colors.secondaryGreen }} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.orderStatus);
                            setShowStatusModal(true);
                          }}
                          className="p-2 rounded hover:bg-gray-100 transition-colors"
                          title="Update Status"
                        >
                          <FiEdit2 size={18} style={{ color: colors.primeGreen }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
                Update Order Status
              </h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                  setNewStatus("");
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiX size={24} style={{ color: colors.darkgray }} />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-poppins text-sm mb-2" style={{ color: colors.darkgray }}>
                Order ID: <span className="font-mono font-semibold">{selectedOrder.uniqueOrderId}</span>
              </p>
              <p className="font-poppins text-sm mb-4" style={{ color: colors.darkgray }}>
                Customer: {selectedOrder.User?.fullName}
              </p>

              <label className="block font-poppins text-sm font-medium mb-2" style={{ color: colors.darkgray }}>
                Select New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg font-poppins"
                style={{ borderColor: colors.lightgray }}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                  setNewStatus("");
                }}
                className="flex-1 px-4 py-2 border rounded-lg font-poppins font-medium transition-colors"
                style={{ borderColor: colors.lightgray, color: colors.darkgray }}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 px-4 py-2 rounded-lg font-poppins font-medium text-white transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.primeGreen }}
                disabled={updating || newStatus === selectedOrder.orderStatus}
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheck size={18} />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6" style={{ borderColor: colors.lightgray }}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-poppins font-semibold" style={{ color: colors.darkgray }}>
                  Order Details
                </h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX size={24} style={{ color: colors.darkgray }} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                      Order ID
                    </p>
                    <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                      #{selectedOrder.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                      Order Status
                    </p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-poppins font-medium"
                      style={{
                        backgroundColor: statusColors[selectedOrder.orderStatus],
                        color: "white",
                      }}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                      Payment Status
                    </p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-poppins font-medium"
                      style={{
                        backgroundColor: paymentStatusColors[selectedOrder.paymentStatus],
                        color: "white",
                      }}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                      Order Date
                    </p>
                    <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border rounded-lg p-4" style={{ borderColor: colors.lightgray }}>
                <div className="flex items-center gap-2 mb-4">
                  <FiUser size={20} style={{ color: colors.primeGreen }} />
                  <h3 className="text-lg font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    Customer Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                      Full Name
                    </p>
                    <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                      {selectedOrder.User?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                      Email
                    </p>
                    <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                      {selectedOrder.User?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                      Phone
                    </p>
                    <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                      {selectedOrder.User?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="border rounded-lg p-4" style={{ borderColor: colors.lightgray }}>
                  <div className="flex items-center gap-2 mb-4">
                    <FiMapPin size={20} style={{ color: colors.primeGreen }} />
                    <h3 className="text-lg font-poppins font-semibold" style={{ color: colors.darkgray }}>
                      Shipping Address
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                        Recipient Name
                      </p>
                      <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                        {selectedOrder.shippingAddress.recipientName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                        Phone Number
                      </p>
                      <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                        {selectedOrder.shippingAddress.phoneNumber}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                        Complete Address
                      </p>
                      <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                        {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode},{" "}
                        {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="border rounded-lg p-4" style={{ borderColor: colors.lightgray }}>
                <div className="flex items-center gap-2 mb-4">
                  <FiShoppingBag size={20} style={{ color: colors.primeGreen }} />
                  <h3 className="text-lg font-poppins font-semibold" style={{ color: colors.darkgray }}>
                    Order Items
                  </h3>
                </div>
                <div className="space-y-3">
                  {selectedOrder.OrderItems?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      {item.Product?.images?.[0] && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.Product.images[0]}`}
                          alt={item.Product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                          {item.Product?.title || "N/A"}
                        </p>
                        <p className="text-sm font-poppins" style={{ color: colors.lightgray }}>
                          Quantity: {item.quantity} × ₹{item.priceAtPurchase}
                        </p>
                      </div>
                      <p className="font-poppins font-semibold" style={{ color: colors.primeGreen }}>
                        ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="border rounded-lg p-4" style={{ borderColor: colors.lightgray }}>
                <h3 className="text-lg font-poppins font-semibold mb-4" style={{ color: colors.darkgray }}>
                  Payment Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-poppins" style={{ color: colors.lightgray }}>
                      Payment Method
                    </p>
                    <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-poppins" style={{ color: colors.lightgray }}>
                      Subtotal
                    </p>
                    <p className="font-poppins font-medium" style={{ color: colors.darkgray }}>
                      ₹{selectedOrder.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: colors.lightgray }}>
                    <p className="font-poppins font-semibold" style={{ color: colors.darkgray }}>
                      Total Amount
                    </p>
                    <p className="font-poppins font-bold text-xl" style={{ color: colors.primeGreen }}>
                      ₹{selectedOrder.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
