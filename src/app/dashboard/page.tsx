"use client";

import { colors } from "@/utils/color";
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign } from "react-icons/fi";

export default function DashboardPage() {
  const stats = [
    { label: "Total Users", value: "1,234", icon: FiUsers, color: colors.primeGreen },
    { label: "Total Sellers", value: "567", icon: FiShoppingBag, color: colors.primeGold },
    { label: "Total Orders", value: "8,901", icon: FiPackage, color: colors.secondaryGreen },
    { label: "Revenue", value: "$45,678", icon: FiDollarSign, color: colors.primeGold },
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
