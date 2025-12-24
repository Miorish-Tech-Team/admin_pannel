"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, useToast } from "@/components/atoms";
import { TableSkeleton } from "@/components/skeletons";
import { sellerSupportApi, SellerTicket } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiFilter, FiEye, FiMessageCircle, FiX, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function SellerSupportPage() {
  const router = useRouter();
  const toast = useToast();
  
  const [tickets, setTickets] = useState<SellerTicket[]>([]);
  const [allTickets, setAllTickets] = useState<SellerTicket[]>([]); // Store all tickets for stats
  const [filteredTickets, setFilteredTickets] = useState<SellerTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, statusFilter, searchQuery]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await sellerSupportApi.getAllSellerTickets();
      setTickets(response.tickets);
      setAllTickets(response.tickets); // Store all tickets for stats
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to fetch tickets";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketsByStatus = async (status: string) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await sellerSupportApi.getSellerTicketsByStatus(status);
      setTickets(response.tickets);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to fetch tickets";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(query) ||
          t.subject.toLowerCase().includes(query) ||
          t.Seller?.sellerName.toLowerCase().includes(query) ||
          t.Seller?.email.toLowerCase().includes(query)
      );
    }

    setFilteredTickets(filtered);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status !== "all") {
      fetchTicketsByStatus(status as any);
    } else {
      fetchTickets();
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
        className="px-3 py-1 rounded-full text-sm font-poppins capitalize inline-flex items-center gap-1"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        <Icon size={14} />
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

  const getStatusCounts = () => {
    return {
      all: allTickets.length,
      open: allTickets.filter((t) => t.status === "open").length,
      in_progress: allTickets.filter((t) => t.status === "in_progress").length,
      resolved: allTickets.filter((t) => t.status === "resolved").length,
      closed: allTickets.filter((t) => t.status === "closed").length,
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
            Seller Support Tickets
          </h1>
          <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
            Manage and respond to seller support requests
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("all")}
          style={{
            border:
              statusFilter === "all"
                ? `2px solid ${colors.primeGreen}`
                : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">All Tickets</p>
          <p
            className="text-2xl font-bold font-cinzel mt-1"
            style={{ color: colors.primeGreen }}
          >
            {statusCounts.all}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("open")}
          style={{
            border:
              statusFilter === "open"
                ? `2px solid ${colors.primeGold}`
                : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">Open</p>
          <p
            className="text-2xl font-bold font-cinzel mt-1"
            style={{ color: colors.primeGold }}
          >
            {statusCounts.open}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("in_progress")}
          style={{
            border:
              statusFilter === "in_progress"
                ? `2px solid ${colors.secondaryGreen}`
                : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">In Progress</p>
          <p
            className="text-2xl font-bold font-cinzel mt-1"
            style={{ color: colors.secondaryGreen }}
          >
            {statusCounts.in_progress}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("resolved")}
          style={{
            border:
              statusFilter === "resolved"
                ? `2px solid ${colors.primeGreen}`
                : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">Resolved</p>
          <p
            className="text-2xl font-bold font-cinzel mt-1"
            style={{ color: colors.primeGreen }}
          >
            {statusCounts.resolved}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("closed")}
          style={{
            border:
              statusFilter === "closed"
                ? `2px solid ${colors.darkgray}`
                : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">Closed</p>
          <p
            className="text-2xl font-bold font-cinzel mt-1"
            style={{ color: colors.darkgray }}
          >
            {statusCounts.closed}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search by ticket number, subject, seller name, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg font-poppins focus:outline-none focus:ring-2"
          style={{ borderColor: colors.lightgray }}
        />
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
              style={{ color: colors.primeGreen }}
            />
            <p className="mt-4 font-poppins">Loading tickets...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="font-poppins" style={{ color: colors.primeRed }}>
              {error}
            </p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-poppins text-gray-500">
              {statusFilter === "all"
                ? "No seller tickets found."
                : `No ${statusFilter.replace("_", " ")} tickets found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.lightgray }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold font-poppins uppercase tracking-wider">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold font-poppins uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold font-poppins uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold font-poppins uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold font-poppins uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold font-poppins uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold font-poppins uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: colors.lightgray }}>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-poppins font-medium">
                        #{ticket.ticketNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-poppins font-medium">
                        {ticket.Seller?.sellerName || "Unknown"}
                      </p>
                      <p className="text-sm font-poppins text-gray-500">
                        {ticket.Seller?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-poppins font-medium">{ticket.subject}</p>
                      <p
                        className="text-sm font-poppins mt-1 truncate max-w-md"
                        style={{ color: colors.darkgray }}
                      >
                        {ticket.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-poppins">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiMessageCircle
                          size={18}
                          style={{ color: colors.primeGold }}
                        />
                        <span className="font-poppins">
                          {ticket.adminReply ? 1 : 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/support/seller/${ticket.id}`)
                        }
                        className="flex items-center gap-2 px-3 py-1 rounded-lg text-white font-poppins transition-all hover:opacity-90"
                        style={{ backgroundColor: colors.primeGreen }}
                      >
                        <FiEye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
