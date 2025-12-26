import apiClient from "../apiClient";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  productImageUrl: string;
}

export interface Order {
  id: number;
  uniqueOrderId: string;
  userId: number;
  cartId?: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  addressId: number;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  paymentMethod: 'CashOnDelivery' | 'Razorpay' | 'CreditCard' | 'DebitCard' | 'PayPal';
  orderDate: string;
  shippingDate?: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  User?: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
  };
  shippingAddress?: {
    id: number;
    recipientName: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems?: OrderItem[];
}

export interface GetOrdersResponse {
  message: string;
  count: number;
  orders: Order[];
}

export interface UpdateOrderStatusRequest {
  orderId: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface UpdatePaymentStatusRequest {
  orderId: number;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
}

export const orderApi = {
  // Get all orders for admin
  async getAllOrders(params?: {
    orderStatus?: string;
    uniqueOrderId?: string;
    orderDate?: string;
  }): Promise<GetOrdersResponse> {
    const response = await apiClient.get("/common-seller-admin/admin/orders", { params });
    return response.data;
  },

  // Get order by ID
  async getOrderById(orderId: number): Promise<{ order: Order }> {
    const response = await apiClient.get(`/common-seller-admin/admin/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  async updateOrderStatus(
    orderId: number,
    orderStatus: string
  ): Promise<{ message: string; order: Order }> {
    const response = await apiClient.patch(
      `/common-seller-admin/orders/${orderId}/order-status`,
      { orderStatus }
    );
    return response.data;
  },

  // Update payment status
  async updatePaymentStatus(
    orderId: number,
    paymentStatus: string
  ): Promise<{ message: string; order: Order }> {
    const response = await apiClient.patch(
      `/common-seller-admin/orders/${orderId}/payment-status`,
      { paymentStatus }
    );
    return response.data;
  },

  // Update shipping dates
  async updateShippingDates(
    orderId: number,
    dates: { shippingDate?: string; deliveryDate?: string }
  ): Promise<{ message: string; order: Order }> {
    const response = await apiClient.patch(
      `/common-seller-admin/orders/${orderId}/shipping-dates`,
      dates
    );
    return response.data;
  },

  // Delete order
  async deleteOrder(orderId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/common-seller-admin/orders/${orderId}`);
    return response.data;
  },
};
