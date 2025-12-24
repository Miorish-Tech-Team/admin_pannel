"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, useToast } from "@/components/atoms";
import { userSupportApi, UserTicket, TicketMessage } from "@/store/apis";
import { colors } from "@/utils/color";
import {
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiSend,
} from "react-icons/fi";
import Image from "next/image";
import { TicketDetailSkeleton } from "@/components/skeletons/TicketDetailSkeleton";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const ticketId = Number(params.id);

  const [ticket, setTicket] = useState<UserTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Reply states
  const [replyMessage, setReplyMessage] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [isCrossQuestion, setIsCrossQuestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      const response = await userSupportApi.getUserTicketById(ticketId);
      setTicket(response.ticket);
      setNewStatus(response.ticket.status);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch ticket");
      toast.error("Failed to fetch ticket details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.warning("Please enter a reply message");
      return;
    }

    if (!ticket) return;

    try {
      setIsSubmitting(true);
      await userSupportApi.replyToUserTicket(ticketId, {
        reply: replyMessage,
        status: newStatus !== ticket.status ? (newStatus as any) : undefined,
        isCrossQuestion,
      });
      
      toast.success(isCrossQuestion ? "Question sent successfully" : "Reply sent successfully");
      setReplyMessage("");
      setIsCrossQuestion(false);
      await fetchTicket();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!ticket || newStatus === ticket.status) return;

    try {
      setIsSubmitting(true);
      await userSupportApi.changeUserTicketStatus(ticketId, {
        status: newStatus as any,
      });
      
      toast.success("Ticket status updated successfully");
      await fetchTicket();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: { bg: `${colors.primeGold}20`, text: colors.primeGold, icon: FiAlertCircle },
      in_progress: { bg: `${colors.secondaryGreen}20`, text: colors.secondaryGreen, icon: FiClock },
      resolved: { bg: `${colors.primeGreen}20`, text: colors.primeGreen, icon: FiCheckCircle },
      closed: { bg: `${colors.darkgray}20`, text: colors.darkgray, icon: FiX },
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
      <TicketDetailSkeleton />
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/support/customer">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiArrowLeft size={24} style={{ color: colors.primeGreen }} />
            </button>
          </Link>
          <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
            Ticket Details
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-lg font-poppins" style={{ color: colors.primeRed }}>
            {error || "Ticket not found"}
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
          <Link href="/dashboard/support/customer">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FiArrowLeft size={24} style={{ color: colors.primeGreen }} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
              Ticket #{ticket.ticketNumber}
            </h1>
            <p className="mt-1 font-poppins text-gray-600">
              Created on {formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>
        {getStatusBadge(ticket.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold font-cinzel mb-4" style={{ color: colors.darkgray }}>
              {ticket.subject}
            </h2>
            <div className="mb-4">
              <p className="text-sm font-poppins font-bold text-gray-600 mb-2">Description:</p>
              <p className="font-poppins text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>
            {ticket.image && (
              <div className="mt-4">
                <p className="text-sm font-poppins font-bold text-gray-600 mb-2">Attachment:</p>
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={ticket.image}
                    alt="Ticket attachment"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          {/* Conversation Thread */}
          {ticket.messages && ticket.messages.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold font-cinzel mb-4" style={{ color: colors.darkgray }}>
                Conversation
              </h3>
              <div className="space-y-4">
                {ticket.messages.map((msg: TicketMessage, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      msg.sender === "admin"
                        ? "bg-blue-50 ml-8"
                        : "bg-gray-50 mr-8"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold font-poppins" style={{ color: colors.darkgray }}>
                        {msg.sender === "admin" ? "You (Admin)" : ticket.User?.fullName || "Customer"}
                      </p>
                      <p className="text-xs font-poppins text-gray-500">
                        {formatDate(msg.timestamp)}
                      </p>
                    </div>
                    <p className="font-poppins text-gray-700">{msg.message}</p>
                    {msg.isCrossQuestion && (
                      <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-poppins rounded">
                        Question
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply Section */}
          {ticket.status !== "closed" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold font-cinzel mb-4" style={{ color: colors.darkgray }}>
                Send Reply
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium font-poppins mb-2" style={{ color: colors.darkgray }}>
                    Reply Message
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1 min-h-30"
                    style={{ ["--tw-ring-color" as any]: colors.primeGold }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="crossQuestion"
                    checked={isCrossQuestion}
                    onChange={(e) => setIsCrossQuestion(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: colors.primeGold }}
                  />
                  <label htmlFor="crossQuestion" className="text-sm font-poppins text-gray-700 cursor-pointer">
                    Mark as cross-question (requires customer response)
                  </label>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleReply}
                  disabled={isSubmitting || !replyMessage.trim()}
                  className="w-full"
                >
                  <FiSend size={18} />
                  {isSubmitting ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold font-cinzel mb-4" style={{ color: colors.darkgray }}>
              Customer Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiUser size={18} style={{ color: colors.primeGreen }} />
                <div>
                  <p className="text-xs font-poppins text-gray-500">Name</p>
                  <p className="font-poppins text-gray-700">{ticket.User?.fullName || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMail size={18} style={{ color: colors.primeGreen }} />
                <div>
                  <p className="text-xs font-poppins text-gray-500">Email</p>
                  <p className="font-poppins text-gray-700">{ticket.User?.email || "N/A"}</p>
                </div>
              </div>
              {ticket.User?.phone && (
                <div className="flex items-center gap-3">
                  <FiPhone size={18} style={{ color: colors.primeGreen }} />
                  <div>
                    <p className="text-xs font-poppins text-gray-500">Phone</p>
                    <p className="font-poppins text-gray-700">{ticket.User.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold font-cinzel mb-4" style={{ color: colors.darkgray }}>
              Status Management
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-poppins mb-2" style={{ color: colors.darkgray }}>
                  Change Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1"
                  style={{ ["--tw-ring-color" as any]: colors.primeGold }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              {newStatus !== ticket.status && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleStatusChange}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Update Status
                </Button>
              )}
            </div>
          </div>

          {/* Ticket Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold font-cinzel mb-4" style={{ color: colors.darkgray }}>
              Ticket Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-poppins text-gray-500">Ticket Number</p>
                <p className="font-poppins font-semibold" style={{ color: colors.primeGreen }}>
                  #{ticket.ticketNumber}
                </p>
              </div>
              <div>
                <p className="text-xs font-poppins text-gray-500">Created</p>
                <p className="font-poppins text-gray-700">{formatDate(ticket.createdAt)}</p>
              </div>
              {ticket.updatedAt && (
                <div>
                  <p className="text-xs font-poppins text-gray-500">Last Updated</p>
                  <p className="font-poppins text-gray-700">{formatDate(ticket.updatedAt)}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-poppins text-gray-500">Messages</p>
                <p className="font-poppins text-gray-700">{ticket.messages?.length || 0} messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
