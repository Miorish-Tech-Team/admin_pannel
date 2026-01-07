"use client";

import { useState, useEffect } from "react";
import { adminProfileApi, AdminProfile } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiCamera } from "react-icons/fi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    state: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await adminProfileApi.getAdminProfile();
      setProfile(response);
      setFormData({
        fullName: response.fullName || "",
        phone: response.phone || "",
        state: response.state || "",
        city: response.city || "",
        country: response.country || "",
        zipCode: response.zipCode || "",
      });
      if (response.profilePhoto) {
        // If the photo URL is relative, prepend the API base URL
        const photoUrl = response.profilePhoto.startsWith('http') 
          ? response.profilePhoto 
          : `${API_BASE_URL}${response.profilePhoto}`;
        setPreviewUrl(photoUrl);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setIsSaving(true);
      setError("");
      setSuccessMessage("");

      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      if (formData.phone) formDataToSend.append("phone", formData.phone);
      if (formData.state) formDataToSend.append("state", formData.state);
      if (formData.city) formDataToSend.append("city", formData.city);
      if (formData.country) formDataToSend.append("country", formData.country);
      if (formData.zipCode) formDataToSend.append("zipCode", formData.zipCode);
      if (selectedFile) formDataToSend.append("profilePhoto", selectedFile);

      await adminProfileApi.updateAdminProfile({ userId: profile.id, data: formDataToSend });
      
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setSelectedFile(null);
      await fetchProfile();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        state: profile.state || "",
        city: profile.city || "",
        country: profile.country || "",
        zipCode: profile.zipCode || "",
      });
      setPreviewUrl(profile.profilePhoto || "");
      setSelectedFile(null);
    }
    setIsEditing(false);
    setError("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primeGreen mx-auto mb-4"></div>
          <p className="font-poppins" style={{ color: colors.darkgray }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
          My Profile
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-poppins font-medium transition-colors"
            style={{
              backgroundColor: colors.primeGreen,
              color: colors.white,
            }}
          >
            <FiEdit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "#fee", color: "#c33" }}>
          <p className="font-poppins">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "#efe", color: "#3c3" }}>
          <p className="font-poppins">{successMessage}</p>
        </div>
      )}

      <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.white }}>
        {/* Profile Photo Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b" style={{ borderColor: colors.base }}>
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: colors.base,
                border: `2px solid ${colors.primeGreen}`,
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <FiUser size={48} style={{ color: colors.darkgray }} />
              )}
            </div>
            {isEditing && (
              <label
                htmlFor="profilePhoto"
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                style={{ backgroundColor: colors.primeGreen }}
              >
                <FiCamera size={20} style={{ color: colors.white }} />
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-cinzel font-semibold mb-1" style={{ color: colors.primeGreen }}>
              {profile?.fullName}
            </h2>
            <p className="font-poppins mb-1" style={{ color: colors.darkgray }}>
              {profile?.email}
            </p>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-poppins font-medium"
              style={{
                backgroundColor: `${colors.primeGreen}20`,
                color: colors.primeGreen,
              }}
            >
              {profile?.role}
            </span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-cinzel font-semibold mb-4" style={{ color: colors.primeGreen }}>
            Profile Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                <FiUser size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg font-poppins focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.base,
                    border: `1px solid ${colors.lightgray}`,
                    color: colors.darkgray,
                  }}
                />
              ) : (
                <p className="px-4 py-2 font-poppins" style={{ color: colors.darkgray }}>
                  {profile?.fullName || "N/A"}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                <FiMail size={16} />
                Email
              </label>
              <p className="px-4 py-2 font-poppins" style={{ color: colors.darkgray }}>
                {profile?.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                <FiPhone size={16} />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg font-poppins focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.base,
                    border: `1px solid ${colors.lightgray}`,
                    color: colors.darkgray,
                  }}
                />
              ) : (
                <p className="px-4 py-2 font-poppins" style={{ color: colors.darkgray }}>
                  {profile?.phone || "N/A"}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="flex items-center gap-2 text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                <FiMapPin size={16} />
                State
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg font-poppins focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.base,
                    border: `1px solid ${colors.lightgray}`,
                    color: colors.darkgray,
                  }}
                />
              ) : (
                <p className="px-4 py-2 font-poppins" style={{ color: colors.darkgray }}>
                  {profile?.state || "N/A"}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                <FiMapPin size={16} />
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg font-poppins focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.base,
                    border: `1px solid ${colors.lightgray}`,
                    color: colors.darkgray,
                  }}
                />
              ) : (
                <p className="px-4 py-2 font-poppins" style={{ color: colors.darkgray }}>
                  {profile?.city || "N/A"}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="flex items-center gap-2 text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                <FiMapPin size={16} />
                Country
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg font-poppins focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.base,
                    border: `1px solid ${colors.lightgray}`,
                    color: colors.darkgray,
                  }}
                />
              ) : (
                <p className="px-4 py-2 font-poppins" style={{ color: colors.darkgray }}>
                  {profile?.country || "N/A"}
                </p>
              )}
            </div>

            {/* Zip Code */}
            <div>
              <label className="flex items-center gap-2 text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                <FiMapPin size={16} />
                Zip Code
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg font-poppins focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.base,
                    border: `1px solid ${colors.lightgray}`,
                    color: colors.darkgray,
                  }}
                />
              ) : (
                <p className="px-4 py-2 font-poppins" style={{ color: colors.darkgray }}>
                  {profile?.zipCode || "N/A"}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg font-poppins font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: colors.primeGreen,
                  color: colors.white,
                }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg font-poppins font-medium transition-colors"
                style={{
                  backgroundColor: colors.base,
                  color: colors.darkgray,
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
