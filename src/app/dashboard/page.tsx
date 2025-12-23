"use client";

import { useEffect, useState } from "react";
import { dashboardApi, DashboardStats } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign } from "react-icons/fi";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    sellers: 0,
    products: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardApi.getAllStats();
      setStats(response);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch dashboard stats");
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    { 
      label: "Total Customers", 
      value: isLoading ? "..." : stats.customers.toLocaleString(), 
      icon: FiUsers, 
      color: colors.primeGreen 
    },
    { 
      label: "Total Sellers", 
      value: isLoading ? "..." : stats.sellers.toLocaleString(), 
      icon: FiShoppingBag, 
      color: colors.primeGold 
    },
    { 
      label: "Total Products", 
      value: isLoading ? "..." : stats.products.toLocaleString(), 
      icon: FiPackage, 
      color: colors.secondaryGreen 
    },
    { 
      label: "Revenue", 
      value: "Coming Soon", 
      icon: FiDollarSign, 
      color: colors.primeGold 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-cinzel" style={{ color: colors.primeGreen }}>
          Dashboard
        </h1>
        <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
          Welcome to Miorish Admin Panel
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-poppins">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-md p-6 border-l-4"
            style={{ borderLeftColor: stat.color }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-poppins text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold font-cinzel mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <stat.icon size={40} style={{ color: stat.color, opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <h2 className="text-2xl font-bold font-cinzel mb-4" style={{ color: colors.primeGreen }}>
          More Features Coming Soon
        </h2>
        <p className="font-poppins text-gray-600">
          We are working on bringing you advanced analytics, charts, and insights.
        </p>
      </div>
    </div>
  );
}
