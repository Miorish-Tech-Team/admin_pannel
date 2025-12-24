"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, useToast } from "@/components/atoms";
import { sellerSupportApi, SellerTicket, SellerTicketMessage } from "@/store/apis";
import { colors } from "@/utils/color";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiSend,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

export default function SellerTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const ticketId = parseInt(params.id as string);

  const [ticket, setTicket] = useState<SellerTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<string>("");
  const [isCrossQuestion, setIsCrossQuestion] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  // Status change state
  const [newStatus, setNewStatus] = useState("");
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await sellerSupportApi.getSellerTicketById(ticketId);
      setTicket(response.ticket);
      setNewStatus(response.ticket.status);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to fetch ticket";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    if (ticket?.status === "closed") {
      toast.error("Cannot reply to a closed ticket");
      return;
    }

    try {
      setIsReplying(true);
      await sellerSupportApi.replyToSellerTicket(ticketId, {
        reply: replyText,
        status: replyStatus ? (replyStatus as "open" | "in_progress" | "closed" | "resolved") : undefined,
        isCrossQuestion,
      });
      toast.success("Reply sent successfully");
      setReplyText("");
      setReplyStatus("");
      setIsCrossQuestion(false);
      await fetchTicket();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to send reply";
      toast.error(errorMsg);
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === ticket?.status) {
      return;
    }

    try {
      setIsChangingStatus(true);
      await sellerSupportApi.changeSellerTicketStatus(ticketId, { status: newStatus as any });
      toast.success("Status changed successfully");
      await fetchTicket();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to change status";
      toast.error(errorMsg);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: {
        bg: `${colors.primeGold}20`,
        text: colors.primeGold,
        icon: FiAlertCircle,
      },
      in_progress: {
        bg: `${colors.secondaryGreen}20`,
        text: colors.secondaryGreen,
        icon: FiClock,
      },
      resolved: {
        bg: `${colors.primeGreen}20`,
        text: colors.primeGreen,
        icon: FiCheckCircle,
      },
      closed: {
        bg: `${colors.darkgray}20`,
        text: colors.darkgray,
        icon: FiX,
      },
    };
    const style = styles[status as keyof typeof styles] || styles.open;
    const Icon = style.icon;

    return (
      <span
        className="px-4 py-2 rounded-full text-sm font-poppins capitalize inline-flex items-center gap-2"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        <Icon size={16} />
        {status.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
          style={{ color: colors.primeGreen }}
        />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <p className="font-poppins text-xl" style={{ color: colors.primeRed }}>
          {error || "Ticket not found"}
        </p>
        <button
          onClick={() => router.push("/dashboard/support/seller")}
          className="mt-4 px-6 py-2 rounded-lg text-white font-poppins"
          style={{ backgroundColor: colors.primeGreen }}
        >
          Back to Seller Support
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/support/seller")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1
            className="text-3xl font-bold font-cinzel"
            style={{ color: colors.primeGreen }}
          >
            Seller Ticket #{ticket.ticketNumber}
          </h1>
          <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
            {ticket.subject}
          </p>
        </div>
        {getStatusBadge(ticket.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Issue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3
              className="text-lg font-bold font-cinzel mb-4"
              style={{ color: colors.primeGreen }}
            >
              Original Issue
            </h3>
            <p className="font-poppins whitespace-pre-wrap">
              {ticket.description}
            </p>
            {ticket.image && (
              <div className="mt-4">
                <img
                  src={ticket.image}
                  alt="Ticket attachment"
                  className="max-w-full rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Conversation Thread */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3
              className="text-lg font-bold font-cinzel mb-4 flex items-center gap-2"
              style={{ color: colors.primeGreen }}
            >
              <FiMessageCircle size={20} />
              Conversation ({ticket.messages?.length || 0})
            </h3>

            {ticket.messages && ticket.messages.length > 0 ? (
              <div className="space-y-4">
                {ticket.messages.map((msg: SellerTicketMessage, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      msg.sender === "admin"
                        ? "bg-green-50 ml-8"
                        : "bg-gray-50 mr-8"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-poppins font-semibold"
                        style={{
                          color:
                            msg.sender === "admin"
                              ? colors.primeGreen
                              : colors.primeGold,
                        }}
                      >
                        {msg.sender === "admin"
                          ? "You (Admin)"
                          : ticket.Seller?.sellerName || "Seller"}
                        {msg.isCrossQuestion && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            Question
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-poppins text-gray-500">
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                    <p className="font-poppins whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-poppins text-gray-500 text-center py-4">
                No messages yet. Be the first to respond...
              </p>
            )}
          </div>

          {/* Reply Form */}
          {ticket.status !== "closed" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3
                className="text-lg font-bold font-cinzel mb-4"
                style={{ color: colors.primeGreen }}
              >
                Send Reply
              </h3>
              <form onSubmit={handleReply} className="space-y-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-2 border rounded-lg font-poppins focus:outline-none focus:ring-2"
                  style={{
                    borderColor: colors.lightgray,
                  }}
                  disabled={isReplying}
                />

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="crossQuestion"
                      checked={isCrossQuestion}
                      onChange={(e) => setIsCrossQuestion(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="crossQuestion"
                      className="font-poppins text-sm"
                    >
                      Mark as cross-question
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isReplying || !replyText.trim()}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-poppins transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: colors.primeGreen }}
                >
                  <FiSend size={18} />
                  {isReplying ? "Sending..." : "Send Reply"}
                </button>
              </form>
            </div>
          )}

          {ticket.status === "closed" && (
            <div
              className="bg-red-50 border-l-4 p-4 rounded"
              style={{ borderColor: colors.primeRed }}
            >
              <p
                className="font-poppins font-semibold"
                style={{ color: colors.primeRed }}
              >
                This ticket is closed
              </p>
              <p className="font-poppins text-sm mt-1">
                Closed tickets cannot receive new replies. Change the status to
                reopen.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3
              className="text-lg font-bold font-cinzel mb-4"
              style={{ color: colors.primeGreen }}
            >
              Seller Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiUser size={20} style={{ color: colors.primeGold }} />
                <div>
                  <p className="text-sm font-poppins font-semibold text-gray-600">
                    Name
                  </p>
                  <p className="font-poppins text-gray-700">
                    {ticket.Seller?.sellerName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMail size={20} style={{ color: colors.primeGold }} />
                <div>
                  <p className="text-sm font-poppins font-semibold text-gray-600">
                    Email
                  </p>
                  <p className="font-poppins text-gray-700">
                    {ticket.Seller?.email || "N/A"}
                  </p>
                </div>
              </div>
              {ticket.Seller?.contactNumber && (
                <div className="flex items-start gap-3">
                  <FiPhone size={20} style={{ color: colors.primeGold }} />
                  <div>
                    <p className="text-sm font-poppins font-semibold text-gray-600">
                      Phone
                    </p>
                    <p className="font-poppins text-gray-700">
                      {ticket.Seller.contactNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3
              className="text-lg font-bold font-cinzel mb-4"
              style={{ color: colors.primeGreen }}
            >
              Ticket Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-poppins font-semibold text-gray-600 mb-1">
                  Ticket Number
                </p>
                <p className="font-poppins font-medium">
                  #{ticket.ticketNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-poppins font-semibold text-gray-600 mb-1">
                  Status
                </p>
                {getStatusBadge(ticket.status)}
              </div>
              <div>
                <p className="text-sm font-poppins font-semibold text-gray-600 mb-1">
                  Subject
                </p>
                <p className="font-poppins">{ticket.subject}</p>
              </div>
              <div>
                <p className="text-sm font-poppins font-semibold text-gray-600 mb-1">
                  Created
                </p>
                <p className="font-poppins text-gray-700">
                  {formatDate(ticket.createdAt)}
                </p>
              </div>
              {ticket.updatedAt && (
                <div>
                  <p className="text-sm font-poppins font-semibold text-gray-600 mb-1">
                    Last Updated
                  </p>
                  <p className="font-poppins text-gray-700">
                    {formatDate(ticket.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Change Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3
              className="text-lg font-bold font-cinzel mb-4"
              style={{ color: colors.primeGreen }}
            >
              Change Status
            </h3>
            <div className="space-y-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg font-poppins focus:outline-none focus:ring-2"
                style={{ borderColor: colors.lightgray }}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={handleStatusChange}
                disabled={isChangingStatus || newStatus === ticket.status}
                className="w-full px-4 py-2 rounded-lg text-white font-poppins transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: colors.primeGreen }}
              >
                {isChangingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
