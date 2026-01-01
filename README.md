# Ceylon Cargo Transport (CCT)

Comprehensive logistics management system for cargo tracking and operations.

## Project Structure

This is a monorepo containing:

### Applications
- **Admin Dashboard** (`apps/admin`) - Full-featured admin portal
- **Client Portal** (`apps/client`) - Client shipment tracking interface
- **Showcase Website** (`apps/showcase`) - Public-facing website
- **Backend API** (`apps/api`) - RESTful API server

### Packages
- **UI Components** (`packages/ui`) - Shared React components
- **Types** (`packages/types`) - Shared TypeScript types
- **Utils** (`packages/utils`) - Shared utility functions
- **Configs** - Shared configuration files

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy .env.example files)

3. Run development servers:
   ```bash
   npm run dev
   ```

## Documentation

See the `docs/` directory for comprehensive documentation.

## Deployment

- Admin: Vercel (admin.cct.ceylongrp.com)
- Client: Vercel (client.cct.ceylongrp.com)
- Showcase: Vercel (www.cct.ceylongrp.com)
- API: Render (api.cct.ceylongrp.com)
- Database: MongoDB Atlas

## License

Proprietary - Ceylon Cargo Transport
