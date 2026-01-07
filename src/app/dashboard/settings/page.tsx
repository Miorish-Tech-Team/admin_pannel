"use client";

import { useState, useEffect } from "react";
import { adminProfileApi } from "@/store/apis";
import { colors } from "@/utils/color";
import { FiSettings, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "authenticator">("authenticator");
  const [is2FALoading, setIs2FALoading] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAPassword, setTwoFAPassword] = useState("");
  const [showTwoFAPassword, setShowTwoFAPassword] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFAAction, setTwoFAAction] = useState<"enable" | "disable">("enable");
  const [selectedMethod, setSelectedMethod] = useState<"email" | "authenticator">("authenticator");
  const [isTogglingTwoFA, setIsTogglingTwoFA] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");

  useEffect(() => {
    fetchTwoFactorAuthStatus();
  }, []);

  const fetchTwoFactorAuthStatus = async () => {
    try {
      setIs2FALoading(true);
      const response = await adminProfileApi.getTwoFactorAuthStatus();
      setIs2FAEnabled(response.isTwoFactorAuthEnable);
      setTwoFactorMethod(response.twoFactorMethod || "authenticator");
      setSelectedMethod(response.twoFactorMethod || "authenticator");
    } catch (error: any) {
      console.error("Failed to fetch 2FA status:", error);
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      setIsLoading(true);
      await adminProfileApi.changePassword({
        currentPassword,
        newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-cinzel font-bold" style={{ color: colors.primeGreen }}>
          Account Settings
        </h1>
        <p className="mt-2 font-poppins" style={{ color: colors.darkgray }}>
          Manage your account security and preferences
        </p>
      </div>

      {/* Change Password Section */}
      <div className="rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: colors.white }}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: colors.base }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primeGreen}20` }}
          >
            <FiLock size={24} style={{ color: colors.primeGreen }} />
          </div>
          <div>
            <h2 className="text-xl font-cinzel font-semibold" style={{ color: colors.primeGreen }}>
              Change Password
            </h2>
            <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
              Update your password to keep your account secure
            </p>
          </div>
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

        <form onSubmit={handleChangePassword} className="space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg font-poppins focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.base,
                  border: `1px solid ${colors.lightgray}`,
                  color: colors.darkgray,
                }}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.darkgray }}
              >
                {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg font-poppins focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.base,
                  border: `1px solid ${colors.lightgray}`,
                  color: colors.darkgray,
                }}
                placeholder="Enter new password (min. 8 characters)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.darkgray }}
              >
                {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg font-poppins focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.base,
                  border: `1px solid ${colors.lightgray}`,
                  color: colors.darkgray,
                }}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.darkgray }}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.base }}>
            <p className="text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
              Password Requirements:
            </p>
            <ul className="text-sm font-poppins space-y-1" style={{ color: colors.darkgray }}>
              <li className="flex items-center gap-2">
                <span className={newPassword.length >= 8 ? "text-green-600" : ""}>
                  {newPassword.length >= 8 ? "✓" : "•"}
                </span>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <span className={newPassword !== currentPassword && newPassword.length > 0 ? "text-green-600" : ""}>
                  {newPassword !== currentPassword && newPassword.length > 0 ? "✓" : "•"}
                </span>
                Different from current password
              </li>
              <li className="flex items-center gap-2">
                <span className={newPassword === confirmPassword && newPassword.length > 0 ? "text-green-600" : ""}>
                  {newPassword === confirmPassword && newPassword.length > 0 ? "✓" : "•"}
                </span>
                Passwords match
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg font-poppins font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: colors.primeGreen,
                color: colors.white,
              }}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: colors.white }}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: colors.base }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.primeGreen}20` }}
          >
            <FiShield size={24} style={{ color: colors.primeGreen }} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-cinzel font-semibold" style={{ color: colors.primeGreen }}>
              Two-Factor Authentication
            </h2>
            <p className="text-sm font-poppins" style={{ color: colors.darkgray }}>
              Add an extra layer of security to your account
            </p>
          </div>
          {!is2FALoading && (
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-poppins font-medium"
                style={{ color: is2FAEnabled ? colors.primeGreen : colors.darkgray }}
              >
                {is2FAEnabled ? "Enabled" : "Disabled"}
              </span>
              <button
                onClick={() => {
                  setTwoFAAction(is2FAEnabled ? "disable" : "enable");
                  setShow2FAModal(true);
                  setTwoFAPassword("");
                  setTwoFAError("");
                }}
                className={`px-4 py-2 rounded-lg font-poppins font-medium transition-colors`}
                style={{
                  backgroundColor: is2FAEnabled ? "#fee" : colors.primeGreen,
                  color: is2FAEnabled ? "#c33" : colors.white,
                }}
              >
                {is2FAEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="font-poppins text-sm" style={{ color: colors.darkgray }}>
            Two-Factor Authentication (2FA) adds an extra layer of security to your account by requiring
            both your password and a time-based code from your authenticator app to log in.
          </p>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.base }}>
            <p className="text-sm font-poppins font-medium mb-3" style={{ color: colors.darkgray }}>
              How to set up Google Authenticator:
            </p>
            <ul className="text-sm font-poppins space-y-2" style={{ color: colors.darkgray }}>
              <li className="flex items-start gap-2">
                <span className="font-medium" style={{ color: colors.primeGreen }}>1.</span>
                <span>Download Google Authenticator app (or similar) from App Store or Google Play</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium" style={{ color: colors.primeGreen }}>2.</span>
                <span>Click "Enable" above and enter your password</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium" style={{ color: colors.primeGreen }}>3.</span>
                <span>Scan the QR code shown with your authenticator app, or enter the secret key manually</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium" style={{ color: colors.primeGreen }}>4.</span>
                <span>Your app will start generating 6-digit codes that refresh every 30 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium" style={{ color: colors.primeGreen }}>5.</span>
                <span>Use these codes to log in after entering your password</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: colors.lightgray }}>
            <p className="text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
              Recommended Authenticator Apps:
            </p>
            <ul className="text-sm font-poppins space-y-1" style={{ color: colors.darkgray }}>
              <li className="flex items-center gap-2">
                <span style={{ color: colors.primeGreen }}>•</span>
                <span><strong>Google Authenticator</strong> - iOS & Android</span>
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: colors.primeGreen }}>•</span>
                <span><strong>Microsoft Authenticator</strong> - iOS & Android</span>
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: colors.primeGreen }}>•</span>
                <span><strong>Authy</strong> - iOS, Android & Desktop</span>
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: colors.primeGreen }}>•</span>
                <span><strong>1Password</strong> - Cross-platform</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.primeGreen}10` }}>
            <p className="text-xs font-poppins font-medium mb-1" style={{ color: colors.darkgray }}>
              💡 Important Tip:
            </p>
            <p className="text-xs font-poppins" style={{ color: colors.darkgray }}>
              Save the secret key in a secure location. If you lose access to your authenticator app, 
              you'll need this key to restore access to your account.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.white }}
          >
            <h3 className="text-xl font-cinzel font-semibold mb-4" style={{ color: colors.primeGreen }}>
              {twoFAAction === "enable" ? "Enable" : "Disable"} Two-Factor Authentication
            </h3>

            <p className="mb-6 font-poppins text-sm" style={{ color: colors.darkgray }}>
              {twoFAAction === "enable" 
                ? "Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.) and enter your password."
                : "Enter your password to disable two-factor authentication."}
            </p>

            {twoFAError && (
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: "#fee", color: "#c33" }}>
                <p className="font-poppins text-sm">{twoFAError}</p>
              </div>
            )}



            {/* QR Code Display */}
            {qrCodeUrl && (
              <div className="mb-6">
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: colors.base }}>
                  <p className="text-sm font-poppins font-medium mb-3" style={{ color: colors.darkgray }}>
                    Scan this QR code with your authenticator app
                  </p>
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-3" />
                  {secretKey && (
                    <div>
                      <p className="text-xs font-poppins mb-2" style={{ color: colors.darkgray }}>
                        Or enter this key manually:
                      </p>
                      <code className="text-xs bg-white px-3 py-2 rounded block break-all" style={{ color: colors.darkgray }}>
                        {secretKey}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-poppins font-medium mb-2" style={{ color: colors.darkgray }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showTwoFAPassword ? "text" : "password"}
                  value={twoFAPassword}
                  onChange={(e) => setTwoFAPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg font-poppins focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.base,
                    border: `1px solid ${colors.lightgray}`,
                    color: colors.darkgray,
                  }}
                  placeholder="Enter your password"
                  autoFocus={!qrCodeUrl}
                />
                <button
                  type="button"
                  onClick={() => setShowTwoFAPassword(!showTwoFAPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.darkgray }}
                >
                  {showTwoFAPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (!twoFAPassword) {
                    setTwoFAError("Password is required");
                    return;
                  }

                  try {
                    setIsTogglingTwoFA(true);
                    setTwoFAError("");
                    const response = await adminProfileApi.toggleTwoFactorAuth({
                      enable: twoFAAction === "enable",
                      password: twoFAPassword,
                      method: "authenticator"
                    });

                    if (response.qrCode) {
                      // Show QR code for authenticator setup
                      setQrCodeUrl(response.qrCode);
                      setSecretKey(response.secret || "");
                      setTwoFAError("");
                      return;
                    }

                    setIs2FAEnabled(twoFAAction === "enable");
                    setTwoFactorMethod("authenticator");
                    setShow2FAModal(false);
                    setTwoFAPassword("");
                    setQrCodeUrl("");
                    setSecretKey("");
                    setSuccessMessage(
                      `Two-Factor Authentication ${twoFAAction === "enable" ? "enabled" : "disabled"} successfully!`
                    );
                    setTimeout(() => setSuccessMessage(""), 3000);
                  } catch (error: any) {
                    const errorMessage = await error.json().catch(() => ({ message: "Failed to toggle 2FA" }));
                    setTwoFAError(errorMessage.message || "Incorrect password");
                  } finally {
                    setIsTogglingTwoFA(false);
                  }
                }}
                disabled={isTogglingTwoFA}
                className="flex-1 px-4 py-3 rounded-lg font-poppins font-medium transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: twoFAAction === "enable" ? colors.primeGreen : "#c33",
                  color: colors.white,
                }}
              >
                {isTogglingTwoFA ? "Processing..." : qrCodeUrl ? "Complete Setup" : twoFAAction === "enable" ? "Enable 2FA" : "Disable 2FA"}
              </button>
              <button
                onClick={() => {
                  setShow2FAModal(false);
                  setTwoFAPassword("");
                  setTwoFAError("");
                  setQrCodeUrl("");
                  setSecretKey("");
                }}
                disabled={isTogglingTwoFA}
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

