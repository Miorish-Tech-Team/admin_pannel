"use client";

import { colors } from "@/utils/color";
import { FiHelpCircle } from "react-icons/fi";

export default function SellerSupportPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primeGold}20` }}
          >
            <FiHelpCircle size={48} style={{ color: colors.primeGold }} />
          </div>
        </div>
        <h1 className="text-3xl font-bold font-cinzel mb-4" style={{ color: colors.primeGreen }}>
          Seller Support
        </h1>
        <p className="text-lg font-poppins" style={{ color: colors.darkgray }}>
          Features Coming Soon
        </p>
        <p className="mt-4 font-poppins text-gray-600">
          We are working on bringing you seller support ticket management, seller inquiries,
          and resolution tracking.
        </p>
      </div>
    </div>
  );
}
