# Ceylon Cargo Transport - Authentication Pages

## Overview

Complete authentication system for the Ceylon Cargo Transport Admin Dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## Implemented Pages

### 1. **Login** (`/login`)
- Email and password inputs
- Remember me checkbox
- Forgot password link
- Sign up link
- Full form validation

### 2. **Sign Up** (`/signup`)
- First name and last name fields
- Email and mobile (optional) fields
- Password and confirm password fields
- Full form validation
- Login link

### 3. **Forgot Password** (`/forgot-password`)
- Email input
- Send reset email functionality
- Back to login link

### 4. **Password Reset Email Sent** (`/forgot-password/sent`)
- Success confirmation message
- Resend email option
- Back to login button

### 5. **Reset Password** (`/reset-password`)
- New password input
- Confirm password input
- Password strength validation
- Form validation

### 6. **Reset Password Success** (`/reset-password/success`)
- Success confirmation
- Redirect to login

### 7. **Email Verification** (`/verify-email`)
- Verification email sent message
- Resend email option
- Continue button

### 8. **Email Verification Success** (`/verify-email/success`)
- Success confirmation
- Go to home button

### 9. **Mobile Verification (OTP)** (`/verify-mobile`)
- 6-digit OTP input with auto-focus
- Paste support for OTP
- Resend OTP option
- Form validation

### 10. **Mobile Verification Success** (`/verify-mobile/success`)
- Success confirmation
- Go to home button

## Design System

### Colors
- **Primary Purple**: `#8B5CF6` (violet-500)
- **Primary Orange**: `#F97316` (orange-500)
- **Background**: `#F9FAFB` (gray-50)
- **Text Primary**: `#111827` (gray-900)
- **Text Secondary**: `#6B7280` (gray-500)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Font weight 600-700
- **Body**: Font weight 400

## UI Components

### Reusable Components Created

1. **Button** (`components/ui/Button.tsx`)
   - Variants: primary, secondary, outline, ghost, danger
   - Sizes: sm, md, lg
   - Loading states
   - Icon support

2. **Input** (`components/ui/Input.tsx`)
   - Label and error message support
   - Password toggle visibility
   - Left and right icon support
   - Full accessibility

3. **Card** (`components/ui/Card.tsx`)
   - Card, CardHeader, CardTitle, CardDescription
   - CardContent, CardFooter
   - Hover effects

4. **Badge** (`components/ui/Badge.tsx`)
   - Multiple variants for status indicators
   - Different sizes

### Layout Components

**AuthLayout** (`components/layout/AuthLayout.tsx`)
- Split layout design
- Left side: Branding with logo and stats
- Right side: Form content
- Fully responsive
- Mobile-friendly logo

## Features

### Form Validation
- Real-time validation
- Clear error messages
- Field-level error clearing
- Email format validation
- Password strength requirements
- Phone number validation

### User Experience
- Smooth transitions
- Loading states
- Auto-focus on first input
- Keyboard navigation support
- OTP paste support
- Responsive design
- Mobile-first approach

### Security
- Password visibility toggle
- Secure password requirements (min 8 characters)
- Email verification flow
- Mobile verification flow

## File Structure

```
apps/admin/src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home (redirects to login)
│   ├── globals.css                   # Global styles
│   ├── login/page.tsx               # Login page
│   ├── signup/page.tsx              # Sign up page
│   ├── forgot-password/
│   │   ├── page.tsx                 # Forgot password
│   │   └── sent/page.tsx            # Email sent confirmation
│   ├── reset-password/
│   │   ├── page.tsx                 # Reset password form
│   │   └── success/page.tsx         # Success confirmation
│   ├── verify-email/
│   │   ├── page.tsx                 # Email verification
│   │   └── success/page.tsx         # Success confirmation
│   ├── verify-mobile/
│   │   ├── page.tsx                 # Mobile OTP verification
│   │   └── success/page.tsx         # Success confirmation
│   └── dashboard/page.tsx           # Temporary dashboard
├── components/
│   ├── ui/
│   │   ├── Button.tsx               # Button component
│   │   ├── Input.tsx                # Input component
│   │   ├── Card.tsx                 # Card components
│   │   ├── Badge.tsx                # Badge component
│   │   └── index.ts                 # UI exports
│   └── layout/
│       └── AuthLayout.tsx           # Auth page layout
├── lib/
│   └── utils.ts                     # Utility functions
└── types/
    └── index.ts                     # TypeScript types
```

## How to Run

1. **Install dependencies** (if not already installed):
   ```bash
   cd apps/admin
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Open browser at `http://localhost:3001`
   - You'll be redirected to `/login`

## Testing the Auth Flow

### Login Flow
1. Navigate to `/login`
2. Enter any email and password (min 6 characters)
3. Click "Sign in"
4. Redirected to `/dashboard`

### Sign Up Flow
1. Navigate to `/signup`
2. Fill in all required fields
3. Click "Sign up"
4. Redirected to `/verify-email`
5. Click "I've verified my email"
6. Redirected to `/verify-email/success`

### Password Reset Flow
1. Navigate to `/forgot-password`
2. Enter email address
3. Click "Send email"
4. Redirected to `/forgot-password/sent`
5. Navigate to `/reset-password`
6. Enter new password and confirm
7. Click "Reset password"
8. Redirected to `/reset-password/success`

### Mobile Verification Flow
1. Navigate to `/verify-mobile`
2. Enter 6-digit OTP
3. Click "Verify OTP"
4. Redirected to `/verify-mobile/success`

## Next Steps

The authentication system is complete and ready for:
1. API integration (replace mock API calls with real endpoints)
2. Dashboard implementation (shipments, containers, clients, etc.)
3. State management (user context, authentication state)
4. Protected routes middleware
5. Session management
6. Token storage

## Notes

- This is a demo implementation with mock data
- All API calls are simulated with `setTimeout`
- Form validation is client-side only
- Ready to be connected to a real backend API
- All components follow accessibility best practices
- Fully responsive and mobile-friendly

## Design Credits

Design based on the Ceylon Cargo Transport project requirements with a modern, professional interface using Tailwind CSS utilities and a clean purple/orange color scheme.
