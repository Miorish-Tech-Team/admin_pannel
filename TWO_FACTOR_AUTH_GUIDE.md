# Two-Factor Authentication (2FA) Implementation Guide

## Overview
The admin panel now supports two methods of two-factor authentication:
1. **Email OTP** - Verification code sent to registered email
2. **Google Authenticator** - Time-based One-Time Password (TOTP) using authenticator apps

## Features

### For Admins
- Enable/disable 2FA from Account Settings
- Choose between Email OTP or Authenticator App
- QR code scanning for easy authenticator setup
- Manual secret key entry option
- Password verification required for all 2FA changes

### Security Features
- Password verification before enabling/disabling 2FA
- Secure TOTP secret generation using cryptographically secure random bytes
- Time-based code validation (30-second windows)
- Automatic code expiration
- Session management with JWT tokens

## How to Use

### Enabling 2FA with Email OTP

1. Navigate to **Dashboard → Settings**
2. Locate the "Two-Factor Authentication" section
3. Click **"Enable Two-Factor Authentication"**
4. In the modal:
   - Select **"Email OTP"** method
   - Enter your current password
   - Click **"Enable 2FA"**
5. 2FA is now enabled - you'll receive codes via email during login

### Enabling 2FA with Google Authenticator

1. Navigate to **Dashboard → Settings**
2. Locate the "Two-Factor Authentication" section
3. Click **"Enable Two-Factor Authentication"**
4. In the modal:
   - Select **"Authenticator App (Google Authenticator, Authy, etc.)"**
   - Enter your current password
   - Click **"Enable 2FA"**
5. A QR code will appear:
   - **Option 1**: Scan the QR code with your authenticator app
   - **Option 2**: Manually enter the secret key shown below the QR code
6. Click **"Complete Setup"** to finish
7. Your authenticator app will now generate 6-digit codes every 30 seconds

### Logging In with 2FA Enabled

#### With Email OTP:
1. Enter your email and password
2. Click **"Sign In"**
3. Check your email for the 6-digit verification code
4. Enter the code in the 2FA modal
5. Click **"Verify & Login"**
6. You can resend the code if needed

#### With Google Authenticator:
1. Enter your email and password
2. Click **"Sign In"**
3. Open your authenticator app
4. Enter the current 6-digit code shown for Miorish
5. Click **"Verify & Login"**
6. Codes refresh every 30 seconds

### Disabling 2FA

1. Navigate to **Dashboard → Settings**
2. Click **"Disable Two-Factor Authentication"**
3. Enter your current password for verification
4. Click **"Disable 2FA"**
5. 2FA is now disabled

### Switching Between Methods

To switch from Email OTP to Authenticator (or vice versa):
1. Disable 2FA (follow steps above)
2. Enable 2FA again with your preferred method

## Supported Authenticator Apps

The TOTP implementation works with any authenticator app that supports the standard TOTP algorithm:
- **Google Authenticator** (iOS, Android)
- **Microsoft Authenticator** (iOS, Android)
- **Authy** (iOS, Android, Desktop)
- **1Password** (with TOTP support)
- **LastPass Authenticator**
- **FreeOTP** (Open source)

## Technical Details

### Backend Implementation

#### Database Schema
```javascript
// User Model fields
{
  isTwoFactorAuthEnable: BOOLEAN (default: false),
  twoFactorMethod: ENUM('email', 'authenticator') (default: 'email'),
  twoFactorSecret: STRING (stores base32 TOTP secret)
}
```

#### API Endpoints

**Get 2FA Status**
```
GET /api/user/profile/two-factor-auth/status
Response: { isTwoFactorAuthEnable: boolean, twoFactorMethod: string }
```

**Toggle 2FA**
```
POST /api/user/profile/two-factor-auth/toggle
Body: { enable: boolean, password: string, method?: "email" | "authenticator" }
Response (authenticator): { 
  message: string, 
  isTwoFactorAuthEnable: boolean,
  qrCode?: string, // Base64 image
  secret?: string, // Base32 secret
  twoFactorMethod: string 
}
```

**Verify 2FA Code**
```
POST /api/user/auth/verify-2fa
Body: { verificationCode: string, userId?: string }
Response: { message: string, user: object }
```

#### Dependencies
- **speakeasy** (v2.0.0): TOTP secret generation and verification
- **qrcode** (v1.5.4): QR code image generation

### Frontend Implementation

#### Key Components

**Settings Page** (`src/app/dashboard/settings/page.tsx`)
- Method selection interface
- QR code display
- Password verification modal
- Status display

**Login Page** (`src/app/dashboard/login/page.tsx`)
- 2FA verification modal
- Different UI for email vs authenticator
- Auto-focus on code input
- Enter key support

#### API Service

**Profile API** (`src/store/apis/profile/adminProfileApi.ts`)
```typescript
interface Toggle2FAPayload {
  enable: boolean;
  password: string;
  method?: "email" | "authenticator";
}

interface Toggle2FAResponse {
  message: string;
  isTwoFactorAuthEnable: boolean;
  qrCode?: string;
  secret?: string;
  twoFactorMethod: string;
}
```

**Auth API** (`src/store/apis/auth/authApi.ts`)
```typescript
interface SignInResponse {
  userId: string;
  isTwoFactorAuthEnable: boolean;
  twoFactorMethod?: "email" | "authenticator";
  // ... other fields
}

interface Verify2FAPayload {
  verificationCode: string;
  userId?: string; // Required for authenticator method
}
```

## Security Considerations

### TOTP Algorithm
- Uses HMAC-SHA1 algorithm (RFC 6238 standard)
- 30-second time step
- 6-digit code generation
- Time window validation (±1 window for clock skew)

### Secret Key Storage
- Secrets are base32 encoded
- Stored encrypted in database
- Never exposed in logs
- Only shown once during setup

### Password Verification
- Current password required for all 2FA changes
- Prevents unauthorized 2FA modifications
- Protects against session hijacking

### Best Practices
1. **Backup Codes**: Consider implementing backup codes for account recovery
2. **Rate Limiting**: Implement rate limiting on verification attempts
3. **Audit Logging**: Log all 2FA enable/disable events
4. **Secret Rotation**: Allow users to regenerate secrets if compromised

## Troubleshooting

### QR Code Not Scanning
- Ensure good lighting and steady hand
- Try zooming the QR code
- Use manual secret key entry instead

### Code Not Working
- Check time synchronization on your device
- Ensure you're entering the current code (codes expire every 30 seconds)
- Verify you're using the correct account in your authenticator app

### Lost Access to Authenticator
- **Prevention**: Save the secret key during setup
- **Recovery**: Contact system administrator for manual 2FA reset
- **Future**: Implement backup codes feature

### Email OTP Not Received
- Check spam/junk folder
- Verify email address is correct in profile
- Use "Resend" button to request new code

## Future Enhancements

1. **Backup Codes**: Generate one-time use backup codes during setup
2. **Recovery Options**: Alternative recovery methods (phone, security questions)
3. **Device Trust**: Remember trusted devices for 30 days
4. **Push Notifications**: App-based push notification approval
5. **Biometric Authentication**: Fingerprint/Face ID support
6. **Activity Monitoring**: Login attempt notifications
7. **Multiple Authenticators**: Register multiple devices
8. **SMS OTP**: Add SMS as third authentication method

## Testing Checklist

### Email OTP
- [ ] Enable email 2FA with password verification
- [ ] Receive email with 6-digit code
- [ ] Login successfully with valid code
- [ ] Reject invalid/expired codes
- [ ] Resend code functionality works
- [ ] Disable 2FA successfully

### Google Authenticator
- [ ] Enable authenticator 2FA with password verification
- [ ] QR code displays correctly
- [ ] Secret key is shown for manual entry
- [ ] Scan QR code with authenticator app
- [ ] App generates 6-digit codes
- [ ] Login successfully with valid TOTP code
- [ ] Reject invalid codes
- [ ] Codes update every 30 seconds
- [ ] Disable 2FA successfully

### Security
- [ ] Cannot enable/disable without correct password
- [ ] Secrets are stored encrypted
- [ ] TOTP secrets are cryptographically secure
- [ ] Session handling after 2FA verification
- [ ] Multiple failed attempts handling

### UI/UX
- [ ] Clear instructions for both methods
- [ ] QR code is scannable
- [ ] Secret key is copy-able
- [ ] Error messages are helpful
- [ ] Loading states work correctly
- [ ] Modal can be canceled
- [ ] Responsive design on mobile

## Code Examples

### Scanning QR Code in Google Authenticator
1. Open Google Authenticator app
2. Tap "+" or "Add account"
3. Select "Scan a QR code"
4. Point camera at QR code on screen
5. Account will be added automatically

### Manual Entry in Google Authenticator
1. Open Google Authenticator app
2. Tap "+" or "Add account"
3. Select "Enter a setup key"
4. Enter:
   - **Account name**: Miorish Admin
   - **Your key**: [Copy the secret key from screen]
   - **Type of key**: Time based
5. Tap "Add" to finish

## Support

For issues or questions:
- Check this guide first
- Review error messages carefully
- Contact system administrator
- Check browser console for technical errors

---

**Last Updated**: 2025
**Version**: 1.0.0
