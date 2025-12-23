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
      console.log("Login successful:", response);
      // Redirect to dashboard
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
    </div>
  );
}
