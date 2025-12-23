"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { FiMenu } from "react-icons/fi";
import { colors } from "@/utils/color";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.base }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header
          className="lg:hidden sticky top-0 z-30 h-16 flex items-center justify-between px-6 shadow-sm"
          style={{ backgroundColor: colors.white }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
            style={{ color: colors.primeGreen }}
          >
            <FiMenu size={24} />
          </button>

          <h2 className="text-xl font-cinzel font-semibold" style={{ color: colors.primeGreen }}>
            Admin Dashboard
          </h2>

          <div className="w-8 lg:w-0"></div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
