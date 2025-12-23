import apiClient from "../apiClient";

export interface SellerTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "closed" | "resolved";
  adminReply?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  Seller?: {
    id: number;
    sellerName: string;
    email: string;
    contactNumber?: string;
  };
}

export interface ReplyToSellerTicketPayload {
  adminReply: string;
  status?: "open" | "in_progress" | "closed" | "resolved";
}

export interface ChangeSellerTicketStatusPayload {
  status: "open" | "in_progress" | "closed" | "resolved";
}

export const sellerSupportApi = {
  // Get all seller tickets
  getAllSellerTickets: async (): Promise<{ tickets: SellerTicket[] }> => {
    const response = await apiClient.get("/support/seller/admin/all-tickets");
    return response.data;
  },

  // Get seller tickets by status
  getSellerTicketsByStatus: async (status: string): Promise<{ tickets: SellerTicket[]; count: number }> => {
    const response = await apiClient.get(`/support/seller/admin/tickets/status/${status}`);
    return response.data;
  },

  // Get single seller ticket by ID
  getSellerTicketById: async (ticketId: number): Promise<{ ticket: SellerTicket }> => {
    const response = await apiClient.get(`/support/seller/admin/all-tickets/${ticketId}`);
    return response.data;
  },

  // Reply to seller ticket
  replyToSellerTicket: async (
    ticketId: number,
    payload: ReplyToSellerTicketPayload
  ): Promise<{ message: string; ticket: SellerTicket }> => {
    const response = await apiClient.put(`/support/seller/admin/reply/${ticketId}`, payload);
    return response.data;
  },

  // Change seller ticket status
  changeSellerTicketStatus: async (
    ticketId: number,
    payload: ChangeSellerTicketStatusPayload
  ): Promise<{ message: string; ticket: SellerTicket }> => {
    const response = await apiClient.put(`/support/seller/admin/change-status/${ticketId}`, payload);
    return response.data;
  },
};
