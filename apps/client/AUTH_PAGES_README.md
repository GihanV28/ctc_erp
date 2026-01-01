# Ceylon Cargo Transport - Client Portal Authentication Pages

## ✅ Completed Features

All authentication pages have been created with the exact design from the provided screenshots, featuring:
- Black background on the left with the CCT logo (purple letters + orange box)
- White rounded card on the right for form content
- Purple gradient outer background
- Consistent styling across all pages

## 📄 Created Pages

### Public Pages
1. **Home Page** - `/` 
   - Landing page with Login/Sign up buttons

### Authentication Flow
2. **Login** - `/login`
   - Email and password fields
   - Remember me checkbox
   - Forgot password link
   - Sign up link

3. **Sign Up** - `/signup`
   - First name, Last name
   - Email, Mobile (optional)
   - Password, Confirm password
   - Login link

4. **Forgot Password** - `/forgot-password`
   - Email input
   - Redirects to `/forgot-password/sent`

5. **Email Sent (Forgot)** - `/forgot-password/sent`
   - Confirmation message with checkmark icon

6. **Reset Password** - `/reset-password`
   - New password input
   - Confirm password input
   - Redirects to `/reset-password/success`

7. **Reset Success** - `/reset-password/success`
   - Success message
   - Login button

8. **Verify Email Sent** - `/verify-email`
   - Email verification sent message

9. **Email Verified** - `/verify-email/success`
   - Success confirmation
   - Go to Home button

10. **Verify Mobile (OTP)** - `/verify-mobile`
    - 6-digit OTP input boxes
    - Auto-focus and auto-submit
    - Redirects to `/verify-mobile/success`

11. **Mobile Verified** - `/verify-mobile/success`
    - Success confirmation
    - Go to Home button

12. **Dashboard** - `/dashboard`
    - Placeholder page for after login

## 🎨 Design System

### Colors
- **Primary Purple**: `#9333ea` (text-purple-600)
- **Primary Orange**: `#f97316` (orange-500)
- **Background**: Purple gradient
- **Left Panel**: Black (`bg-black`)
- **Right Panel**: White (`bg-white`)
- **Input Fields**: Gray background (`bg-gray-100`)

### Components
- **Button** - Primary variant with rounded-full style
- **Input** - Gray background with purple focus ring
- **Success Icon** - Large purple checkmark circle

## 🚀 How to Run

1. **Install Dependencies**
   ```bash
   cd apps/client
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:3001
   ```
   (Next.js will choose port 3001 if 3000 is already used by admin)

## 🔗 Navigation Flow

```
/ (Home) 
  ├─> /login 
  │     └─> /dashboard (on success)
  │     └─> /forgot-password
  │           └─> /forgot-password/sent
  │                 └─> /reset-password
  │                       └─> /reset-password/success
  │                             └─> /login
  └─> /signup
        └─> /verify-email
              └─> /verify-email/success
                    └─> /verify-mobile (optional)
                          └─> /verify-mobile/success
                                └─> /dashboard
```

## 📁 File Structure

```
apps/client/src/
├── app/
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Home page
│   ├── globals.css                         # Global styles
│   ├── login/page.tsx                      # Login page
│   ├── signup/page.tsx                     # Sign up page
│   ├── forgot-password/
│   │   ├── page.tsx                        # Forgot password
│   │   └── sent/page.tsx                   # Email sent confirmation
│   ├── reset-password/
│   │   ├── page.tsx                        # Reset password form
│   │   └── success/page.tsx                # Reset success
│   ├── verify-email/
│   │   ├── page.tsx                        # Email verification sent
│   │   └── success/page.tsx                # Email verified
│   ├── verify-mobile/
│   │   ├── page.tsx                        # OTP input
│   │   └── success/page.tsx                # Mobile verified
│   └── dashboard/page.tsx                  # Dashboard (placeholder)
├── components/
│   ├── layout/
│   │   └── AuthLayout.tsx                  # Auth pages layout with logo
│   └── ui/
│       ├── Button.tsx                      # Button component
│       └── Input.tsx                       # Input component
└── lib/
    └── utils.ts                            # Utility functions
```

## 🔐 Security Features (To be implemented)

- [ ] JWT token management
- [ ] Protected routes middleware
- [ ] API integration for authentication
- [ ] Form validation
- [ ] Error handling
- [ ] Rate limiting
- [ ] CSRF protection

## 🎯 Next Steps

1. Build dashboard pages
2. Integrate with backend API
3. Add form validation
4. Implement real authentication
5. Add protected route middleware
6. Create shipment tracking features
7. Add quote request functionality

## 📝 Notes

- All pages use the same `AuthLayout` component for consistency
- Forms have basic validation (required fields)
- Navigation flows are wired, but currently use setTimeout instead of real API calls
- Ready to be connected to the backend API from `apps/api`
