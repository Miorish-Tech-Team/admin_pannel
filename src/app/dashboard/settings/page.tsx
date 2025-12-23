"use client";

import { colors } from "@/utils/color";
import { FiSettings } from "react-icons/fi";

export default function SettingsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primeGreen}20` }}
          >
            <FiSettings size={48} style={{ color: colors.primeGreen }} />
          </div>
        </div>
        <h1 className="text-3xl font-bold font-cinzel mb-4" style={{ color: colors.primeGreen }}>
          Account Settings
        </h1>
        <p className="text-lg font-poppins" style={{ color: colors.darkgray }}>
          Features Coming Soon
        </p>
        <p className="mt-4 font-poppins text-gray-600">
          We are working on bringing you account settings including profile management, password
          change, notification preferences, and more.
        </p>
      </div>
    </div>
  );
}
