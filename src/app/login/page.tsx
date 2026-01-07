"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/atoms";
import { authApi } from "@/store/apis";
import { colors } from "@/utils/color";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  
  // 2FA States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "authenticator">("authenticator");
  const [userId, setUserId] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.signIn(formData);
      console.log("Login response:", response);
      
      // Check if 2FA is required
      if (response.isTwoFactorAuthEnable) {
        setTwoFactorMethod("authenticator");
        setUserId(response.userId || "");
        setShow2FAModal(true);
        setIsLoading(false);
        return;
      }
      
      // Redirect to dashboard if no 2FA
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setApiError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      // Pass userId for authenticator method verification
      await authApi.verify2FA({ 
        verificationCode,
        userId
      });
      // Redirect to dashboard after successful verification
      router.push("/dashboard");
    } catch (error: any) {
      console.error("2FA verification error:", error);
      setVerificationError(
        error.response?.data?.message ||
          "Invalid or expired verification code. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Opacity */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/logo.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
          style={{ backgroundColor: `${colors.white}` }}
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-bold font-cinzel mb-2"
              style={{ color: colors.primeGreen }}
            >
              Miorish
            </h1>
            <p className="text-lg font-poppins" style={{ color: colors.darkgray }}>
              Admin Panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="admin@gmail.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
            />

            {apiError && (
              <div
                className="p-3 rounded-lg text-sm font-poppins"
                style={{
                  backgroundColor: `${colors.primeRed}20`,
                  color: colors.primeRed,
                }}
              >
                {apiError}
              </div>
            )}

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm font-poppins text-gray-500">
              Miorish Admin Panel © 2025
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Verification Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-lg shadow-xl p-6"
            style={{ backgroundColor: colors.white }}
          >
            <h3 className="text-xl font-cinzel font-semibold mb-2" style={{ color: colors.primeGreen }}>
              Two-Factor Authentication
            </h3>
            <p className="mb-6 font-poppins text-sm" style={{ color: colors.darkgray }}>
              Please enter the 6-digit code from your authenticator app to complete your login.
            </p>

            {verificationError && (
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "#fee", color: "#c33" }}>
                <p className="font-poppins text-sm">{verificationError}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setVerificationCode(value);
                  setVerificationError("");
                }}
                className="w-full px-4 py-3 rounded-lg font-poppins text-center text-2xl tracking-widest focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.base,
                  border: `1px solid ${colors.lightgray}`,
                  color: colors.darkgray,
                }}
                placeholder="000000"
                maxLength={6}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter" && verificationCode.length === 6) {
                    handleVerify2FA();
                  }
                }}
              />
              <p className="mt-2 text-xs font-poppins text-center" style={{ color: colors.darkgray }}>
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerify2FA}
                disabled={isVerifying || verificationCode.length !== 6}
                className="flex-1 px-4 py-3 rounded-lg font-poppins font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: colors.primeGreen,
                  color: colors.white,
                }}
              >
                {isVerifying ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                onClick={() => {
                  setShow2FAModal(false);
                  setVerificationCode("");
                  setVerificationError("");
                }}
                disabled={isVerifying}
                className="px-4 py-3 rounded-lg font-poppins font-medium transition-colors"
                style={{
                  backgroundColor: colors.base,
                  color: colors.darkgray,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
