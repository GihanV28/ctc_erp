# Ceylon Cargo Transport - Showcase Website

This is the public-facing marketing website for Ceylon Cargo Transport, built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- ⚡ Fast performance with Next.js 14 App Router
- 🎭 Smooth animations with Framer Motion
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible (WCAG AA compliant)
- 🔍 SEO optimized with metadata
- 📝 Contact form with validation
- 🎯 Call-to-action sections linking to client portal
- 🚢 Service showcases and container information
- ⭐ Client testimonials carousel
- 📊 Statistics with animated counters
- ❓ FAQ section with accordion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Install dependencies from project root:
```bash
npm install
```

2. Create environment file:
```bash
cd apps/showcase
cp .env.local.example .env.local
```

3. Update the `.env.local` file with your configuration.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003) with your browser to see the result.

### Build

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with SEO
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── animations/        # Animation components
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── sections/          # Page sections (Hero, About, Services, etc.)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── constants.ts       # App constants and data
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript type definitions
```

## Page Sections

1. **Hero** - Full-screen hero with CTA buttons
2. **About** - Company introduction
3. **Services** - 6 service cards
4. **Features** - 6 feature highlights
5. **How It Works** - 4-step process
6. **Statistics** - Animated counters
7. **Containers** - Container types
8. **Testimonials** - Client testimonials carousel
9. **CTA** - Main call-to-action
10. **Track** - Shipment tracking
11. **Contact** - Contact form
12. **FAQ** - Frequently asked questions

## Customization

Edit content in `src/lib/constants.ts` to update services, features, testimonials, FAQs, and contact information.

## License

Proprietary - Ceylon Cargo Transport