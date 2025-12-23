"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, useToast } from "@/components/atoms";
import { TableSkeleton } from "@/components/skeletons";
import { userSupportApi, UserTicket } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiFilter, FiEye, FiMessageCircle, FiX, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function CustomerSupportPage() {
  const router = useRouter();
  const toast = useToast();
  
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [allTickets, setAllTickets] = useState<UserTicket[]>([]); // Store all tickets for stats
  const [filteredTickets, setFilteredTickets] = useState<UserTicket[]>([]);
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
      const response = await userSupportApi.getAllUserTickets();
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
      const response = await userSupportApi.getUserTicketsByStatus(status);
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
          t.User?.fullName.toLowerCase().includes(query) ||
          t.User?.email.toLowerCase().includes(query)
      );
    }

    setFilteredTickets(filtered);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    if (status !== "all") {
      fetchTicketsByStatus(status);
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
            Customer Support Tickets
          </h1>
          <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
            Manage and respond to customer support requests
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("all")}
          style={{
            border: statusFilter === "all" ? `2px solid ${colors.primeGreen}` : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">All Tickets</p>
          <p className="text-2xl font-bold font-cinzel mt-1" style={{ color: colors.primeGreen }}>
            {statusCounts.all}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("open")}
          style={{
            border: statusFilter === "open" ? `2px solid ${colors.primeGold}` : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">Open</p>
          <p className="text-2xl font-bold font-cinzel mt-1" style={{ color: colors.primeGold }}>
            {statusCounts.open}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("in_progress")}
          style={{
            border: statusFilter === "in_progress" ? `2px solid ${colors.secondaryGreen}` : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">In Progress</p>
          <p className="text-2xl font-bold font-cinzel mt-1" style={{ color: colors.secondaryGreen }}>
            {statusCounts.in_progress}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("resolved")}
          style={{
            border: statusFilter === "resolved" ? `2px solid ${colors.primeGreen}` : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">Resolved</p>
          <p className="text-2xl font-bold font-cinzel mt-1" style={{ color: colors.primeGreen }}>
            {statusCounts.resolved}
          </p>
        </div>
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleStatusFilterChange("closed")}
          style={{
            border: statusFilter === "closed" ? `2px solid ${colors.darkgray}` : "2px solid transparent",
          }}
        >
          <p className="text-sm font-poppins text-gray-600">Closed</p>
          <p className="text-2xl font-bold font-cinzel mt-1" style={{ color: colors.darkgray }}>
            {statusCounts.closed}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label
              className="block text-sm font-medium font-poppins mb-2"
              style={{ color: colors.darkgray }}
            >
              Search Tickets
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket number, subject, customer name or email..."
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
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-1"
              style={{ ["--tw-ring-color" as any]: colors.primeGold }}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm font-poppins text-gray-600">
            Showing {filteredTickets.length} of {tickets.length} tickets
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

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={6} />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-poppins text-gray-500">
              {tickets.length === 0
                ? "No tickets found"
                : "No tickets match your filters"}
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
                    Ticket #
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Customer
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold font-poppins"
                    style={{ color: colors.darkgray }}
                  >
                    Subject
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
                    Created
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
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p
                        className="font-medium font-poppins"
                        style={{ color: colors.primeGreen }}
                      >
                        #{ticket.ticketNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="font-medium font-poppins"
                        style={{ color: colors.darkgray }}
                      >
                        {ticket.User?.fullName || "Unknown"}
                      </p>
                      <p className="text-sm font-poppins text-gray-500">
                        {ticket.User?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-poppins text-gray-700 truncate max-w-xs">
                        {ticket.subject}
                      </p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-poppins text-gray-600">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/support/customer/${ticket.id}`)
                          }
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <FiEye
                            size={18}
                            style={{ color: colors.primeGreen }}
                          />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/dashboard/support/customer/${ticket.id}`)
                          }
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Reply"
                        >
                          <FiMessageCircle
                            size={18}
                            style={{ color: colors.primeGold }}
                          />
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
    </div>
  );
}
