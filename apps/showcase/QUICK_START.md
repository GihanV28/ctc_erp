# Ceylon Cargo Transport Showcase - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies (if not already done)
```bash
# From project root
npm install
```

### 2. Configure Environment
```bash
# Navigate to showcase app
cd apps/showcase

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local and set your client portal URL (optional)
# NEXT_PUBLIC_CLIENT_PORTAL_URL=https://client.cct.ceylongrp.com
```

### 3. Run Development Server
```bash
# From project root
npm run dev

# OR from showcase directory
cd apps/showcase && npm run dev
```

Visit: **http://localhost:3003**

## 📦 Build for Production

```bash
cd apps/showcase
npm run build
npm run start
```

## 🎨 Customizing Content

All content is centralized in one file for easy updates:

**File**: `src/lib/constants.ts`

### What You Can Update:

1. **Services** - Add/edit service offerings
2. **Features** - Modify feature highlights
3. **Testimonials** - Update client testimonials
4. **Statistics** - Change company stats
5. **Container Types** - Add/modify container specifications
6. **FAQs** - Update frequently asked questions
7. **Contact Information** - Update address, phone, email
8. **Social Media Links** - Update social media URLs

### Example: Adding a New Service

```typescript
// In src/lib/constants.ts
export const SERVICES: Service[] = [
  // ... existing services
  {
    id: 'custom-brokerage',
    title: 'Custom Brokerage',
    description: 'Expert customs clearance services.',
    icon: 'FileText', // Any Lucide icon name
    link: '#services'
  }
];
```

## 🎯 Key Features

### Navigation
- Smooth scroll to sections via navbar links
- Mobile hamburger menu
- "Join With Us" → Client Portal Signup
- "Log In" → Client Portal Login

### Sections (in order)
1. **Hero** - Main landing section
2. **About** - Company introduction
3. **Services** - Service offerings
4. **Features** - Why choose us
5. **How It Works** - 4-step process
6. **Stats** - Company statistics
7. **Containers** - Container types
8. **Testimonials** - Client reviews
9. **CTA** - Call-to-action
10. **Track** - Shipment tracking
11. **Contact** - Contact form
12. **FAQ** - Common questions

## 🛠️ Common Customizations

### Change Brand Colors

**File**: `tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      violet: {
        // Update these hex values
        500: '#8b5cf6',
        600: '#7c3aed',
        // ... etc
      }
    }
  }
}
```

### Update SEO Metadata

**File**: `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Your New Title',
  description: 'Your new description',
  // ... update other fields
};
```

### Change Client Portal URLs

**File**: `.env.local`

```env
NEXT_PUBLIC_CLIENT_PORTAL_URL=https://your-portal-url.com
```

## 📸 Adding Images

Place images in `public/images/`:

```
public/images/
├── hero/
│   └── cargo-port.jpg       # Hero background
├── about/
│   └── warehouse.jpg        # About section image
├── services/
│   └── *.jpg                # Service images
├── containers/
│   └── *.jpg                # Container images
└── logos/
    └── logo.png             # Company logo
```

Update image paths in components as needed.

## 🔧 Development Tips

### Hot Reload
Changes to components automatically refresh in browser.

### TypeScript Errors
Check terminal for TypeScript errors during development.

### Tailwind CSS
Use Tailwind utility classes for styling. IntelliSense provides autocomplete.

### Icons
All icons from [Lucide React](https://lucide.dev/icons/):
- Import: `import { IconName } from 'lucide-react'`
- Usage: `<IconName className="h-6 w-6" />`

## 🐛 Troubleshooting

### Build Warnings
Lockfile patching warnings are normal in monorepo setup. Can be safely ignored.

### Port Already in Use
Change port in `package.json`:
```json
"dev": "next dev -p 3004"  // Use different port
```

### Environment Variables Not Working
- Ensure `.env.local` exists
- Prefix with `NEXT_PUBLIC_` for client-side access
- Restart dev server after changes

### Images Not Loading
- Check file path is correct
- Ensure image exists in `public/` directory
- Use relative paths from `public/` (e.g., `/images/hero/photo.jpg`)

## 📚 Documentation

- **README.md** - Complete project documentation
- **IMPLEMENTATION_SUMMARY.md** - Technical implementation details
- **This file** - Quick start guide

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_CLIENT_PORTAL_URL`
4. Deploy

### Manual Deployment

```bash
npm run build
# Deploy .next folder and node_modules to server
npm run start
```

## 💡 Support

For questions or issues:
- Check documentation in this folder
- Review code comments in components
- Contact: support@ceyloncargo.lk

## ✅ Pre-Launch Checklist

- [ ] Update all content in `constants.ts`
- [ ] Add company images to `public/images/`
- [ ] Set environment variables
- [ ] Update SEO metadata
- [ ] Test all forms
- [ ] Test on mobile devices
- [ ] Verify all links work
- [ ] Run production build
- [ ] Test client portal redirects

---

**You're all set!** 🎉

Run `npm run dev` and start customizing your showcase website.
