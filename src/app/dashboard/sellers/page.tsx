"use client";

import React, { useState } from "react";
import { colors } from "@/utils/color";
import { FaUserCheck, FaStore, FaChartLine, FaCrown } from "react-icons/fa";
import PendingApprovals from "./pending/page";
import AllSellers from "./all/page";
import SellerAnalytics from "./analytics/page";
import MembershipManagement from "./membership/page";

type TabType = "pending" | "all" | "analytics" | "membership";

export default function SellersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const tabs = [
    {
      id: "pending" as TabType,
      label: "Pending Approvals",
      icon: <FaUserCheck size={18} />,
    },
    {
      id: "all" as TabType,
      label: "All Sellers",
      icon: <FaStore size={18} />,
    },
    {
      id: "analytics" as TabType,
      label: "Seller Analytics",
      icon: <FaChartLine size={18} />,
    },
    {
      id: "membership" as TabType,
      label: "Membership Plans",
      icon: <FaCrown size={18} />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "pending":
        return <PendingApprovals />;
      case "all":
        return <AllSellers />;
      case "analytics":
        return <SellerAnalytics />;
      case "membership":
        return <MembershipManagement />;
      default:
        return <PendingApprovals />;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
          Seller Management
        </h1>
        <p className="mt-2 font-poppins text-sm sm:text-base" style={{ color: colors.darkgray }}>
          Manage seller applications, approvals, analytics, and memberships
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div
          className="flex flex-wrap gap-2 p-1 rounded-lg"
          style={{ backgroundColor: colors.offYellow }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-poppins font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "shadow-md"
                  : "hover:opacity-70"
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? colors.primeGreen : "transparent",
                color: activeTab === tab.id ? colors.white : colors.darkgray,
              }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}
