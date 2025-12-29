"use client";

import React, { useState } from "react";
import { colors } from "@/utils/color";
import { FaSearch, FaTimes, FaEnvelope, FaPhone, FaCrown } from "react-icons/fa";
import { sellerApi, Seller } from "@/store/apis/seller/sellerApi";
import { useToast, Input, Button } from "@/components/atoms";

interface SearchSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSellerFound: (seller: Seller) => void;
}

type SearchType = "email" | "contact" | "membershipId";

export default function SearchSellerModal({
  isOpen,
  onClose,
  onSellerFound,
}: SearchSellerModalProps) {
  const { error } = useToast();
  const [searchType, setSearchType] = useState<SearchType>("email");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      error("Please enter a search value");
      return;
    }

    setIsSearching(true);
    try {
      let response;
      
      switch (searchType) {
        case "email":
          response = await sellerApi.getSellerByEmail(searchValue.trim());
          break;
        case "contact":
          response = await sellerApi.getSellerByContact(searchValue.trim());
          break;
        case "membershipId":
          response = await sellerApi.getSellerByMembershipId(parseInt(searchValue.trim()));
          break;
      }

      if (response.seller) {
        onSellerFound(response.seller);
        handleClose();
      }
    } catch (err: any) {
      console.error("Error searching seller:", err);
      if (err.response?.status === 404) {
        error("Seller not found");
      } else {
        error("Failed to search seller");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    setSearchValue("");
    setSearchType("email");
    onClose();
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case "email":
        return "Enter seller's email address";
      case "contact":
        return "Enter seller's contact number";
      case "membershipId":
        return "Enter membership ID";
    }
  };

  const getIcon = () => {
    switch (searchType) {
      case "email":
        return <FaEnvelope style={{ color: colors.primeGold }} />;
      case "contact":
        return <FaPhone style={{ color: colors.primeGold }} />;
      case "membershipId":
        return <FaCrown style={{ color: colors.primeGold }} />;
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg shadow-xl max-w-md w-full"
        style={{ backgroundColor: colors.white }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.lightgray }}
        >
          <div className="flex items-center gap-3">
            <FaSearch size={24} style={{ color: colors.primeGreen }} />
            <h3 className="text-xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
              Search Seller
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
          >
            <FaTimes size={20} style={{ color: colors.darkgray }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: colors.darkgray }}>
              Search By
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["email", "contact", "membershipId"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                    searchType === type ? "shadow-md" : ""
                  }`}
                  style={{
                    backgroundColor: searchType === type ? colors.primeGreen : colors.white,
                    borderColor: searchType === type ? colors.primeGreen : colors.lightgray,
                    color: searchType === type ? colors.white : colors.black,
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    {type === "email" && <FaEnvelope size={16} />}
                    {type === "contact" && <FaPhone size={16} />}
                    {type === "membershipId" && <FaCrown size={16} />}
                    <span className="text-xs font-poppins capitalize">
                      {type === "membershipId" ? "Membership" : type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: colors.darkgray }}>
              {searchType === "email" && "Email Address"}
              {searchType === "contact" && "Contact Number"}
              {searchType === "membershipId" && "Membership ID"}
            </label>
            <div className="relative">
              {/* <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                {getIcon()}
              </div> */}
              <Input
                type={searchType === "membershipId" ? "number" : "text"}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={getPlaceholder()}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: colors.lightgray }}
        >
          <Button
            onClick={handleClose}
            disabled={isSearching}
            variant="outline"
            size="md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchValue.trim()}
            variant="primary"
            size="md"
            isLoading={isSearching}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
