"use client";

import React from "react";
import { colors } from "@/utils/color";
import { FaStore, FaHardHat } from "react-icons/fa";

export default function AllSellersPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
          All Sellers
        </h2>
        <p className="mt-1 font-poppins text-sm" style={{ color: colors.darkgray }}>
          View and manage all registered sellers
        </p>
      </div>

      {/* Coming Soon */}
      <div
        className="text-center py-16 rounded-xl"
        style={{ backgroundColor: colors.white }}
      >
        <FaHardHat size={64} style={{ color: colors.primeGold }} className="mx-auto mb-4" />
        <h3 className="text-2xl font-cinzel font-bold mb-2" style={{ color: colors.primeGreen }}>
          Coming Soon
        </h3>
        <p className="font-poppins text-sm max-w-md mx-auto" style={{ color: colors.darkgray }}>
          This feature is under development. You'll be able to view and manage all approved sellers here.
        </p>
      </div>
    </div>
  );
}
