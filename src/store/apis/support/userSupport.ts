import apiClient from "../apiClient";

export interface UserTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "closed" | "resolved";
  adminReply?: string;
  messages?: TicketMessage[];
  image?: string;
  createdAt: string;
  updatedAt?: string;
  User?: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
  };
}

export interface TicketMessage {
  sender: "user" | "admin";
  message: string;
  timestamp: string;
  isCrossQuestion?: boolean;
}

export interface ReplyToTicketPayload {
  reply: string;
  status?: "open" | "in_progress" | "closed" | "resolved";
  isCrossQuestion?: boolean;
}

export interface ChangeTicketStatusPayload {
  status: "open" | "in_progress" | "closed" | "resolved";
}

export const userSupportApi = {
  // Get all user tickets
  getAllUserTickets: async (): Promise<{ tickets: UserTicket[]; count: number }> => {
    const response = await apiClient.get("/support/user/admin/all-tickets");
    return response.data;
  },

  // Get user tickets by status
  getUserTicketsByStatus: async (status: string): Promise<{ tickets: UserTicket[]; count: number }> => {
    const response = await apiClient.get(`/support/user/admin/tickets/status/${status}`);
    return response.data;
  },

  // Get single ticket by ID
  getUserTicketById: async (ticketId: number): Promise<{ ticket: UserTicket }> => {
    const response = await apiClient.get(`/support/user/admin/all-tickets/${ticketId}`);
    return response.data;
  },

  // Reply to user ticket
  replyToUserTicket: async (
    ticketId: number,
    payload: ReplyToTicketPayload
  ): Promise<{ message: string; ticket: UserTicket }> => {
    const response = await apiClient.post(`/support/user/admin/reply/${ticketId}`, payload);
    return response.data;
  },

  // Change ticket status
  changeUserTicketStatus: async (
    ticketId: number,
    payload: ChangeTicketStatusPayload
  ): Promise<{ message: string; ticket: UserTicket }> => {
    const response = await apiClient.put(`/support/user/admin/change-status/${ticketId}`, payload);
    return response.data;
  },
};
