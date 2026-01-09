# Ceylon Cargo Transport - Complete Deployment Guide

## Overview

This guide will walk you through deploying the Ceylon Cargo Transport application with the following setup:

| Component | Platform | Domain |
|-----------|----------|--------|
| Backend API | Render | `api.cct.ceylongrp.com` |
| Showcase Website | Vercel | `cct.ceylongrp.com` |
| Client Portal | Vercel | `client.cct.ceylongrp.com` |
| Admin Panel | Vercel | `admin.cct.ceylongrp.com` |
| Email | Namecheap Private Email | `info.cct@ceylongrp.com` |
| Database | MongoDB Atlas | (Already configured) |

---

## Phase 1: DNS Setup in Namecheap

### Step 1.1: Access Namecheap DNS Management

1. Log in to [Namecheap](https://www.namecheap.com/)
2. Go to **Dashboard** → **Domain List**
3. Click **Manage** next to `ceylongrp.com`
4. Click **Advanced DNS** tab

### Step 1.2: Create DNS Records for Subdomains

Add the following DNS records. **Note:** You'll update the actual values after deploying to Render and Vercel.

#### Initial Placeholder Records (Add these now)

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | cct | `cname.vercel-dns.com` | Automatic |
| CNAME | client.cct | `cname.vercel-dns.com` | Automatic |
| CNAME | admin.cct | `cname.vercel-dns.com` | Automatic |
| CNAME | api.cct | `your-app-name.onrender.com` | Automatic |

> **Important:** The `api.cct` CNAME value will be updated after you deploy to Render and get your actual Render URL.

### Step 1.3: Email DNS Records (For Namecheap Private Email)

If you're using Namecheap Private Email, these records are usually auto-configured. Verify these exist:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| MX | @ | `mx1.privateemail.com` (Priority: 10) | Automatic |
| MX | @ | `mx2.privateemail.com` (Priority: 10) | Automatic |
| TXT | @ | `v=spf1 include:spf.privateemail.com ~all` | Automatic |

For the subdomain email `info.cct@ceylongrp.com`, you may need:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| MX | cct | `mx1.privateemail.com` (Priority: 10) | Automatic |
| MX | cct | `mx2.privateemail.com` (Priority: 10) | Automatic |

---

## Phase 2: Email Configuration (Namecheap Private Email)

### Step 2.1: Purchase/Activate Private Email

1. Go to Namecheap Dashboard
2. Click **Private Email** in the sidebar
3. Purchase a Private Email plan for `ceylongrp.com` if not already done
4. Create the mailbox: `info.cct@ceylongrp.com`

### Step 2.2: Get SMTP/IMAP Credentials

Once the mailbox is created, use these settings:

#### SMTP Settings (For Sending Emails)
```
Host: mail.privateemail.com
Port: 587 (TLS) or 465 (SSL)
Username: info.cct@ceylongrp.com
Password: [Your email password]
Encryption: STARTTLS (for 587) or SSL (for 465)
```

#### IMAP Settings (For Receiving Emails)
```
Host: mail.privateemail.com
Port: 993 (SSL)
Username: info.cct@ceylongrp.com
Password: [Your email password]
Encryption: SSL/TLS
```

#### POP3 Settings (Alternative for Receiving)
```
Host: mail.privateemail.com
Port: 995 (SSL)
Username: info.cct@ceylongrp.com
Password: [Your email password]
Encryption: SSL/TLS
```

### Step 2.3: Test Email Access

1. Go to [privateemail.com](https://privateemail.com)
2. Log in with `info.cct@ceylongrp.com` and your password
3. Send a test email to verify it works

---

## Phase 3: Backend Deployment (Render)

### Step 3.1: Create Render Account & Connect GitHub

1. Go to [Render](https://render.com/) and sign up/log in
2. Connect your GitHub account
3. Give Render access to the `ceylon-cargo-transport` repository

### Step 3.2: Create New Web Service

1. Click **New +** → **Web Service**
2. Select your repository: `ceylon-cargo-transport`
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `cct-api` |
| **Region** | Choose nearest to your users (e.g., Singapore for Sri Lanka) |
| **Branch** | `main` |
| **Root Directory** | `apps/api` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (or paid for production) |

### Step 3.3: Configure Environment Variables

In the Render dashboard, go to **Environment** and add these variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database (Your existing MongoDB Atlas)
MONGODB_URI=mongodb+srv://cctAdmin:cctAdmin%40123@cct-cluster.p4cbtlr.mongodb.net/ceylon-cargo-transport?retryWrites=true&w=majority&appName=CCT-Cluster

# JWT Secrets (CHANGE THESE FOR PRODUCTION!)
JWT_SECRET=your-super-secure-production-jwt-secret-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secure-production-refresh-secret-minimum-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (Namecheap Private Email)
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info.cct@ceylongrp.com
SMTP_PASS=YOUR_EMAIL_PASSWORD_HERE
SMTP_FROM=info.cct@ceylongrp.com
SMTP_FROM_NAME=Ceylon Cargo Transport

# Frontend URLs (Production)
ADMIN_URL=https://admin.cct.ceylongrp.com
CLIENT_URL=https://client.cct.ceylongrp.com
SHOWCASE_URL=https://cct.ceylongrp.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Pagination
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS (Production URLs)
CORS_ORIGIN=https://admin.cct.ceylongrp.com,https://client.cct.ceylongrp.com,https://cct.ceylongrp.com
```

> **IMPORTANT:** Replace `YOUR_EMAIL_PASSWORD_HERE` with your actual email password and generate new secure JWT secrets for production!

### Step 3.4: Deploy the Service

1. Click **Create Web Service**
2. Wait for the build and deployment to complete
3. Note your Render URL (e.g., `cct-api.onrender.com`)

### Step 3.5: Add Custom Domain to Render

1. In your Render service, go to **Settings** → **Custom Domains**
2. Click **Add Custom Domain**
3. Enter: `api.cct.ceylongrp.com`
4. Render will give you a CNAME target (e.g., `cct-api.onrender.com`)

### Step 3.6: Update Namecheap DNS for API

Go back to Namecheap Advanced DNS and update/add:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | api.cct | `cct-api.onrender.com` | Automatic |

> Wait 5-30 minutes for DNS propagation, then verify in Render that the domain is connected.

### Step 3.7: Verify API Deployment

Test these URLs:
- `https://api.cct.ceylongrp.com/api/health` (if you have a health endpoint)
- `https://api.cct.ceylongrp.com/api-docs` (Swagger documentation)

---

## Phase 4: Frontend Deployments (Vercel)

### Step 4.1: Create Vercel Account & Connect GitHub

1. Go to [Vercel](https://vercel.com/) and sign up/log in
2. Connect your GitHub account
3. Give Vercel access to the `ceylon-cargo-transport` repository

---

### Step 4.2: Deploy Showcase Website

#### Create Project
1. Click **Add New...** → **Project**
2. Import `ceylon-cargo-transport` repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Project Name** | `cct-showcase` |
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/showcase` |
| **Build Command** | `cd ../.. && npm install && npm run build --filter=showcase` |
| **Output Directory** | Leave default |
| **Install Command** | `npm install` |

#### Environment Variables
Add these in the Vercel project settings:

```env
NEXT_PUBLIC_API_URL=https://api.cct.ceylongrp.com/api
NEXT_PUBLIC_APP_NAME=Ceylon Cargo Transport
```

#### Custom Domain
1. Go to **Settings** → **Domains**
2. Add domain: `cct.ceylongrp.com`
3. Vercel will show you the required DNS records

#### Update Namecheap DNS
Ensure this record exists:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | cct | `cname.vercel-dns.com` | Automatic |

Or if Vercel gives you an A record:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | cct | `76.76.21.21` | Automatic |

---

### Step 4.3: Deploy Client Portal

#### Create Project
1. Click **Add New...** → **Project**
2. Import `ceylon-cargo-transport` repository (same repo, different root)
3. Configure:

| Setting | Value |
|---------|-------|
| **Project Name** | `cct-client` |
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/client` |
| **Build Command** | `cd ../.. && npm install && npm run build --filter=client` |
| **Output Directory** | Leave default |
| **Install Command** | `npm install` |

#### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.cct.ceylongrp.com/api
NEXT_PUBLIC_APP_NAME=CCT Client Portal
```

#### Custom Domain
1. Go to **Settings** → **Domains**
2. Add domain: `client.cct.ceylongrp.com`

#### Update Namecheap DNS

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | client.cct | `cname.vercel-dns.com` | Automatic |

---

### Step 4.4: Deploy Admin Panel

#### Create Project
1. Click **Add New...** → **Project**
2. Import `ceylon-cargo-transport` repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Project Name** | `cct-admin` |
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/admin` |
| **Build Command** | `cd ../.. && npm install && npm run build --filter=admin` |
| **Output Directory** | Leave default |
| **Install Command** | `npm install` |

#### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.cct.ceylongrp.com/api
NEXT_PUBLIC_APP_NAME=CCT Admin Dashboard
```

#### Custom Domain
1. Go to **Settings** → **Domains**
2. Add domain: `admin.cct.ceylongrp.com`

#### Update Namecheap DNS

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | admin.cct | `cname.vercel-dns.com` | Automatic |

---

## Phase 5: Final Configuration & Testing

### Step 5.1: Verify All DNS Records

Your final Namecheap Advanced DNS should look like:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | cct | `cname.vercel-dns.com` | Automatic |
| CNAME | client.cct | `cname.vercel-dns.com` | Automatic |
| CNAME | admin.cct | `cname.vercel-dns.com` | Automatic |
| CNAME | api.cct | `cct-api.onrender.com` | Automatic |
| MX | @ | `mx1.privateemail.com` | Automatic |
| MX | @ | `mx2.privateemail.com` | Automatic |
| TXT | @ | `v=spf1 include:spf.privateemail.com ~all` | Automatic |

### Step 5.2: Test All Endpoints

1. **Showcase:** https://cct.ceylongrp.com
2. **Client Portal:** https://client.cct.ceylongrp.com
3. **Admin Panel:** https://admin.cct.ceylongrp.com
4. **API:** https://api.cct.ceylongrp.com/api-docs

### Step 5.3: Test Email Functionality

1. Go to the showcase website
2. Submit an inquiry form
3. Check if the email is received at `info.cct@ceylongrp.com`
4. From admin panel, try sending an email (if that feature exists)

### Step 5.4: SSL Certificate Verification

Both Render and Vercel provide free SSL certificates automatically. Verify:
- All URLs work with `https://`
- No certificate warnings in browser
- HTTP redirects to HTTPS

---

## Troubleshooting

### DNS Not Propagating
- Wait up to 48 hours for full propagation
- Use [DNS Checker](https://dnschecker.org/) to verify
- Clear browser cache

### CORS Errors
- Verify `CORS_ORIGIN` in Render includes all frontend URLs
- Ensure URLs use `https://` not `http://`
- Check for trailing slashes

### Email Not Working
- Verify SMTP credentials in Render environment
- Check email password doesn't have special characters that need escaping
- Test SMTP connection using a tool like [SMTPer](https://www.smtper.net/)

### Build Failures on Vercel
- Check build logs for specific errors
- Ensure root directory is correct
- Verify environment variables are set

### Render Service Sleeping (Free Tier)
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid tier for production

---

## Production Checklist

Before going live, ensure:

- [ ] All DNS records are properly configured
- [ ] SSL certificates are active on all domains
- [ ] JWT secrets are changed from defaults
- [ ] Email password is set correctly
- [ ] CORS origins are set to production URLs
- [ ] MongoDB Atlas IP whitelist includes Render IPs (or 0.0.0.0/0 for all)
- [ ] All environment variables are set in Render and Vercel
- [ ] Test inquiry form submission
- [ ] Test user registration/login
- [ ] Test admin panel functionality
- [ ] Set up monitoring/alerts (optional)

---

## Quick Reference - Production URLs

| Service | URL |
|---------|-----|
| Showcase | https://cct.ceylongrp.com |
| Client Portal | https://client.cct.ceylongrp.com |
| Admin Panel | https://admin.cct.ceylongrp.com |
| API | https://api.cct.ceylongrp.com |
| API Docs | https://api.cct.ceylongrp.com/api-docs |
| Webmail | https://privateemail.com |

---

## Support Contacts

- **Namecheap Support:** https://www.namecheap.com/support/
- **Render Support:** https://render.com/docs
- **Vercel Support:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/

---

*Last Updated: January 2026*
