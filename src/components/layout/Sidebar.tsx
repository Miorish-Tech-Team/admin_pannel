"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { colors } from "@/utils/color";
import {
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiTag,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { GiKnightBanner } from "react-icons/gi";
import { FaBlog } from "react-icons/fa";
import { authApi } from "@/store/apis";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: FiHome },
  { name: "My Profile", path: "/dashboard/profile", icon: FiUser },
  { name: "User", path: "/dashboard/users", icon: FiUsers },
  {
    name: "Seller",
    icon: FiShoppingBag,
    submenu: [
      { name: "Pending Approvals", path: "/dashboard/sellers/pending" },
      { name: "All Sellers", path: "/dashboard/sellers/all" },
      { name: "Seller Analytics", path: "/dashboard/sellers/analytics" },
      { name: "Membership Plans", path: "/dashboard/sellers/membership" },
    ],
  },
  { name: "Order", path: "/dashboard/orders", icon: FiPackage },
  {
    name: "Product",
    icon: FiTag,
    submenu: [
      { name: "Categories", path: "/dashboard/categories" },
      { name: "Subcategories", path: "/dashboard/subcategories" },
      { name: "Products", path: "/dashboard/products" },
      { name: "Pending Products", path: "/dashboard/product-management" },
      { name: "My Products", path: "/dashboard/my-products" },
    ],
  },
  { name: "Handle Banners", path: "/dashboard/banners", icon: GiKnightBanner },
  { name: "Blog", path: "/dashboard/blogs", icon: FaBlog },
  { name: "Warehouse", path: "/dashboard/warehouses", icon: FiMapPin },
  {
    name: "Support",
    icon: FiHelpCircle,
    submenu: [
      { name: "Seller Support", path: "/dashboard/support/seller" },
      { name: "Customer Support", path: "/dashboard/support/customer" },
    ],
  },
  { name: "Account Settings", path: "/dashboard/settings", icon: FiSettings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ backgroundColor: colors.primeGreen }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold font-cinzel" style={{ color: colors.white }}>
              Miorish
            </h1>
            <button onClick={onClose} className="lg:hidden" style={{ color: colors.white }}>
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className="flex cursor-pointer items-center justify-between w-full px-4 py-3 rounded-lg font-poppins text-sm transition-colors duration-200"
                        style={{
                          color: colors.white,
                          backgroundColor:
                            expandedMenu === item.name ? `${colors.primeGold}30` : "transparent",
                        }}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon size={20} />
                          {item.name}
                        </span>
                        {/* <span
                          className={`transform transition-transform ${
                            expandedMenu === item.name ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span> */}
                      </button>
                      {expandedMenu === item.name && (
                        <ul className="ml-8 mt-2 space-y-1">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.path}
                                onClick={onClose}
                                className="block px-4 py-2 rounded-lg font-poppins text-sm transition-colors duration-200"
                                style={{
                                  color: colors.white,
                                  backgroundColor:
                                    pathname === subItem.path
                                      ? colors.primeGold
                                      : "transparent",
                                }}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-poppins text-sm transition-colors duration-200"
                      style={{
                        color: colors.white,
                        backgroundColor: pathname === item.path ? colors.primeGold : "transparent",
                      }}
                    >
                      <item.icon size={20} />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-poppins text-sm transition-colors duration-200 hover:bg-white/10"
              style={{ color: colors.white }}
            >
              <FiLogOut size={20} />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
