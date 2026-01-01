# Ceylon Cargo Transport - Client Portal
## Comprehensive Development Plan

### Overview
The Client Portal is a customer-facing web application that allows Ceylon Cargo Transport clients to:
- Track their shipments in real-time
- Request new shipping quotes
- Manage their account and profile
- View invoices and payment history
- Access shipment documents
- Communicate with support

---

## Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Authentication**: JWT-based (to be integrated with API)

### Project Structure
```
apps/client/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing/Home page
│   │   ├── (auth)/              # Auth group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── verify-email/
│   │   └── (dashboard)/         # Dashboard group
│   │       ├── layout.tsx
│   │       ├── dashboard/       # Main dashboard
│   │       ├── shipments/       # Shipment tracking
│   │       ├── quotes/          # Request quotes
│   │       ├── invoices/        # Billing & invoices
│   │       ├── documents/       # Document library
│   │       ├── profile/         # User profile
│   │       └── support/         # Help & support
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Timeline.tsx
│   │   ├── dashboard/           # Dashboard-specific
│   │   ├── shipments/           # Shipment components
│   │   ├── quotes/              # Quote components
│   │   └── shared/              # Shared components
│   ├── lib/
│   │   ├── utils.ts             # Utility functions
│   │   ├── mockData.ts          # Mock data
│   │   └── constants.ts         # Constants
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useShipments.ts
│   │   └── useInvoices.ts
│   └── styles/
│       └── globals.css          # Global styles
├── public/                      # Static assets
│   ├── images/
│   └── icons/
├── .env.local                   # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Features & Pages

### 1. Landing Page (Public)
**Route**: `/`
- Hero section with CTA
- Service overview
- Features highlights
- Testimonials
- Contact information
- Login/Signup buttons

### 2. Authentication Pages
**Routes**: `/login`, `/signup`, `/forgot-password`, `/verify-email`

#### Login Page
- Email & password fields
- Remember me checkbox
- Forgot password link
- Social login options (optional)
- Redirect to dashboard on success

#### Signup Page
- Company information
- Contact details
- Email & password
- Terms & conditions acceptance
- Email verification flow

#### Forgot Password
- Email input
- Reset link sent confirmation
- Reset password form

### 3. Dashboard (Protected)
**Route**: `/dashboard`

#### Overview Cards
- Active Shipments count
- Pending Quotes
- Outstanding Invoices
- Recent Activity

#### Quick Actions
- Track Shipment
- Request Quote
- View Invoices
- Contact Support

#### Recent Shipments Table
- Shipment ID
- Origin → Destination
- Status
- ETA
- Quick actions

#### Notifications Panel
- System notifications
- Shipment updates
- Payment reminders

### 4. Shipments Page
**Route**: `/dashboard/shipments`

#### Features
- List view of all shipments
- Search and filter functionality
  - By status (in transit, delivered, pending)
  - By date range
  - By origin/destination
- Shipment cards with:
  - Shipment ID
  - Current location
  - Status badge
  - Progress indicator
  - ETA

#### Shipment Detail View
**Route**: `/dashboard/shipments/[id]`
- Detailed shipment information
- Live tracking map
- Status timeline
- Container details
- Documents section
- Contact information
- Related invoices

### 5. Track Shipment
**Route**: `/dashboard/track`
- Quick track by ID input
- Real-time tracking map
- Status updates timeline
- Estimated delivery date
- Container information
- Route visualization

### 6. Request Quote
**Route**: `/dashboard/quotes`

#### New Quote Form
- Origin & Destination
- Cargo details
  - Type
  - Weight
  - Dimensions
  - Quantity
- Container type selection
- Special requirements
- Preferred dates
- Upload documents (optional)

#### Quote History
- List of requested quotes
- Status (pending, approved, declined)
- Quote details
- Accept/Reject actions
- Convert to shipment

### 7. Invoices & Billing
**Route**: `/dashboard/invoices`

#### Features
- Invoice list with filters
  - Paid
  - Pending
  - Overdue
- Invoice details
  - Invoice number
  - Date
  - Amount
  - Due date
  - Line items
- Download PDF
- Online payment (future)
- Payment history

### 8. Documents
**Route**: `/dashboard/documents`

#### Document Library
- Bill of Lading
- Commercial Invoice
- Packing List
- Certificate of Origin
- Insurance Certificate
- Download/View options
- Organized by shipment
- Search functionality

### 9. Profile & Settings
**Route**: `/dashboard/profile`

#### Company Profile
- Company name
- Business registration
- Contact information
- Billing address
- Shipping addresses

#### User Settings
- Personal information
- Email preferences
- Notification settings
- Password change
- Two-factor authentication

### 10. Support
**Route**: `/dashboard/support`

#### Features
- FAQ section
- Contact form
- Live chat (future)
- Support tickets
- Knowledge base
- Emergency contacts

---

## UI Components

### Core Components

#### Button
```typescript
variants: 'primary' | 'secondary' | 'outline' | 'ghost'
sizes: 'sm' | 'md' | 'lg'
states: default, hover, active, disabled
```

#### Card
```typescript
- Header with title & actions
- Content area
- Footer (optional)
```

#### Badge
```typescript
variants: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
```

#### Input
```typescript
types: text, email, password, number, tel, date
- Label
- Helper text
- Error state
- Icon support
```

#### Modal
```typescript
- Overlay
- Close button
- Header, body, footer
- Sizes: sm, md, lg, xl
```

#### Table
```typescript
- Sortable columns
- Pagination
- Row selection
- Action column
```

#### Timeline
```typescript
- Vertical timeline
- Status indicators
- Timestamps
- Descriptions
```

---

## Data Types

### Shipment
```typescript
interface Shipment {
  id: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed';
  origin: Location;
  destination: Location;
  departureDate: Date;
  estimatedArrival: Date;
  actualArrival?: Date;
  container: Container;
  cargo: CargoDetails;
  trackingUpdates: TrackingUpdate[];
  documents: Document[];
}
```

### Quote
```typescript
interface Quote {
  id: string;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  origin: Location;
  destination: Location;
  cargo: CargoDetails;
  containerType: ContainerType;
  requestDate: Date;
  validUntil: Date;
  estimatedCost?: number;
  notes?: string;
}
```

### Invoice
```typescript
interface Invoice {
  id: string;
  shipmentId: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  lineItems: LineItem[];
  paymentMethod?: string;
  paidDate?: Date;
}
```

---

## Design System

### Colors
```javascript
primary: {
  50: '#faf5ff',
  500: '#9333ea',  // Purple
  600: '#7c3aed',
  900: '#581c87',
}

success: '#10b981'  // Green
warning: '#f59e0b'  // Amber
danger: '#ef4444'   // Red
info: '#3b82f6'     // Blue

neutral: {
  50: '#f9fafb',
  100: '#f3f4f6',
  500: '#6b7280',
  900: '#111827',
}
```

### Typography
```javascript
// Font Family
font-sans: 'Inter', system-ui, sans-serif

// Font Sizes
text-xs: 0.75rem
text-sm: 0.875rem
text-base: 1rem
text-lg: 1.125rem
text-xl: 1.25rem
text-2xl: 1.5rem
text-3xl: 1.875rem
```

### Spacing
```javascript
// Using Tailwind's default spacing scale
0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64
```

### Shadows
```javascript
sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
md: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
```

### Border Radius
```javascript
sm: '0.125rem'
DEFAULT: '0.25rem'
md: '0.375rem'
lg: '0.5rem'
xl: '0.75rem'
2xl: '1rem'
```

---

## Mock Data

### Sample Client Data
```typescript
const mockClient = {
  id: 'CLT-001',
  name: 'Acme Corporation',
  email: 'contact@acme.com',
  phone: '+1 555-0123',
  location: 'New York, USA',
  totalShipments: 45,
  activeShipments: 3,
  totalSpent: 145000,
};
```

### Sample Shipments
- See apps/admin/src/lib/mockData.ts for reference
- Adapt for client perspective

---

## API Integration Points

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`
- POST `/api/auth/verify-email`

### Shipments
- GET `/api/client/shipments`
- GET `/api/client/shipments/:id`
- GET `/api/client/shipments/:id/track`

### Quotes
- GET `/api/client/quotes`
- POST `/api/client/quotes`
- PUT `/api/client/quotes/:id`
- DELETE `/api/client/quotes/:id`

### Invoices
- GET `/api/client/invoices`
- GET `/api/client/invoices/:id`
- GET `/api/client/invoices/:id/download`

### Documents
- GET `/api/client/documents`
- GET `/api/client/documents/:id/download`

### Profile
- GET `/api/client/profile`
- PUT `/api/client/profile`
- PUT `/api/client/profile/password`

---

## Development Phases

### Phase 1: Foundation (Week 1)
- [x] Project setup
- [ ] Basic routing structure
- [ ] Core UI components
- [ ] Layout components
- [ ] Type definitions
- [ ] Mock data setup

### Phase 2: Authentication (Week 1-2)
- [ ] Login page
- [ ] Signup page
- [ ] Forgot password flow
- [ ] Email verification
- [ ] Protected routes
- [ ] Auth context/hooks

### Phase 3: Dashboard (Week 2)
- [ ] Dashboard overview
- [ ] Stats cards
- [ ] Recent activity
- [ ] Quick actions
- [ ] Responsive layout

### Phase 4: Shipments (Week 3)
- [ ] Shipments list page
- [ ] Shipment detail page
- [ ] Track shipment feature
- [ ] Status timeline
- [ ] Filters and search

### Phase 5: Quotes (Week 3-4)
- [ ] Quote request form
- [ ] Quote history
- [ ] Quote detail view
- [ ] Accept/decline actions

### Phase 6: Invoices & Documents (Week 4)
- [ ] Invoice list
- [ ] Invoice detail
- [ ] Download functionality
- [ ] Document library
- [ ] Document viewer

### Phase 7: Profile & Settings (Week 5)
- [ ] Profile page
- [ ] Settings page
- [ ] Password change
- [ ] Notification preferences

### Phase 8: Support (Week 5)
- [ ] Support center
- [ ] Contact form
- [ ] FAQ section

### Phase 9: Polish & Testing (Week 6)
- [ ] Responsive design refinement
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] User testing
- [ ] Bug fixes

### Phase 10: API Integration (Week 7-8)
- [ ] Replace mock data with API calls
- [ ] Error handling
- [ ] Loading states
- [ ] Authentication integration
- [ ] Real-time updates (WebSocket)

---

## Best Practices

### Code Quality
- Use TypeScript for type safety
- Follow consistent naming conventions
- Write reusable components
- Implement proper error handling
- Add loading states
- Handle edge cases

### Performance
- Implement code splitting
- Lazy load components
- Optimize images
- Use React.memo where appropriate
- Implement pagination for large lists

### Security
- Validate all inputs
- Sanitize user data
- Implement CSRF protection
- Secure authentication tokens
- Use HTTPS only
- Implement rate limiting

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus management

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized for all devices

---

## Testing Strategy

### Unit Tests
- Component testing
- Utility function testing
- Custom hooks testing

### Integration Tests
- Page flow testing
- API integration testing
- Form submission testing

### E2E Tests
- User journey testing
- Critical path testing
- Cross-browser testing

---

## Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
```

### Build & Deploy
```bash
npm run build
npm run start
```

### Hosting Options
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Docker container

---

## Future Enhancements

1. **Real-time Tracking**
   - WebSocket integration
   - Live map updates
   - Push notifications

2. **Mobile App**
   - React Native version
   - Native push notifications
   - Offline capability

3. **Advanced Features**
   - Multi-language support
   - Currency converter
   - Automated email notifications
   - Analytics dashboard
   - Export functionality

4. **Payment Integration**
   - Online payment gateway
   - Multiple payment methods
   - Payment schedules
   - Invoice auto-reminders

5. **Communication**
   - In-app messaging
   - Live chat support
   - Video calls with support
   - Automated chatbot

---

## Success Metrics

- User registration rate
- Active users (DAU/MAU)
- Quote conversion rate
- Customer satisfaction score
- Support ticket resolution time
- Page load performance
- Mobile usage percentage

---

## Resources & Documentation

- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- Lucide Icons: https://lucide.dev

---

## Contact & Support

For development questions or issues:
- Project Lead: [Name]
- Tech Lead: [Name]
- Email: dev@ceyloncargo.lk

---

**Last Updated**: December 16, 2024
**Version**: 1.0.0
