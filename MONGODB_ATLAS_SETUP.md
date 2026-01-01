# MongoDB Atlas Setup Guide - Ceylon Cargo Transport

**Complete Step-by-Step Tutorial**

---

## 📋 What You'll Get

By the end of this guide, you'll have:
- ✅ Free MongoDB Atlas account
- ✅ Database cluster running
- ✅ Database user created
- ✅ Connection string for your app
- ✅ IP whitelist configured
- ✅ Database ready to use

**Time Required:** 10-15 minutes
**Cost:** $0 (Free M0 tier - 512MB storage)

---

## Step 1: Create MongoDB Atlas Account

### 1.1 Go to MongoDB Atlas Website

Open your browser and navigate to:
```
https://www.mongodb.com/cloud/atlas/register
```

### 1.2 Sign Up

You have 3 options:

**Option A: Sign up with Google (Recommended - Fastest)**
1. Click "Sign up with Google"
2. Choose your Google account
3. Done! Skip to Step 2

**Option B: Sign up with Email**
1. Enter your details:
   - Email: `your-email@example.com` (use your work email)
   - First Name: `Your Name`
   - Last Name: `Your Last Name`
   - Password: Create a strong password (min 8 characters)
2. Check the box "I agree to the Terms of Service and Privacy Policy"
3. Click "Create your Atlas account"
4. Check your email for verification link
5. Click the verification link

**Option C: Sign up with GitHub**
1. Click "Sign up with GitHub"
2. Authorize MongoDB Atlas
3. Done!

---

## Step 2: Answer Welcome Questions

After signing up, you'll see a welcome survey:

### 2.1 What is your goal today?
- Select: **"Build a new application"**

### 2.2 What type of application are you building?
- Select: **"I'm building a web app"**

### 2.3 What is your preferred language?
- Select: **"JavaScript"**

### 2.4 How would you describe yourself?
- Select: **"I'm learning to code"** or **"I'm getting started as a developer"**

Click **"Finish"** or **"Continue"**

---

## Step 3: Deploy Your First Cluster

Now you'll create your database cluster:

### 3.1 Choose Deployment Type

You'll see "Deploy a cluster" page:

1. **Select:** **"M0 - FREE"** (Left-most option)
   - Storage: 512 MB
   - RAM: Shared
   - Cost: **FREE forever**

### 3.2 Choose Cloud Provider & Region

**Provider:** Select any of these (all free):
- ✅ AWS (Recommended)
- ✅ Google Cloud
- ✅ Azure

**Region:** Choose the closest to Sri Lanka:

**Recommended Regions (pick one):**
1. **Asia Pacific (Mumbai)** - ap-south-1 (AWS) ⭐ BEST for Sri Lanka
2. **Asia Pacific (Singapore)** - ap-southeast-1 (AWS)
3. **Asia Pacific (Mumbai)** - asia-south1 (Google Cloud)

**Why Mumbai/Singapore?**
- Lowest latency from Sri Lanka
- Faster database queries
- Better user experience

### 3.3 Name Your Cluster

**Cluster Name:** `CCT-Cluster` or `ceylon-cargo-transport`

Keep it simple, lowercase, use hyphens.

### 3.4 Click "Create"

Wait 1-3 minutes while MongoDB creates your cluster.

You'll see a progress screen: "Cluster is being created..."

---

## Step 4: Create Database User (IMPORTANT!)

While your cluster is being created, you'll see "Security Quickstart":

### 4.1 Create Database User

**This is NOT your Atlas account login!**
This is a separate user for your application to connect to the database.

Fill in:

1. **Authentication Method:** Password (selected by default)

2. **Username:** `cct-admin`
   - Use lowercase, no spaces
   - Remember this!

3. **Password:** Click "Autogenerate Secure Password"
   - OR create your own strong password
   - **IMPORTANT:** Copy this password immediately!
   - Save it in a secure place (password manager or text file)

Example:
```
Username: cct-admin
Password: xK9mP2nQ7vL4sR8t (example - yours will be different)
```

4. **Built-in Role:**
   - Select: **"Read and write to any database"** (already selected)

5. Click **"Create User"**

---

## Step 5: Configure Network Access (Whitelist IP)

### 5.1 Add IP Address

You'll see "Where would you like to connect from?"

**For Development (Choose One):**

**Option A: Allow Access from Anywhere (Easiest for Development)**
1. Click **"Add My Current IP Address"**
2. Then click **"Add a Different IP Address"**
3. Enter:
   - IP Address: `0.0.0.0/0`
   - Description: `Allow all (development)`
4. Click "Add Entry"

⚠️ **Note:** This allows any IP to connect (less secure, but fine for development)

**Option B: Just Your IP (More Secure)**
1. Click **"Add My Current IP Address"**
2. Your IP will be automatically detected
3. Description: `My Development Machine`
4. Click "Add Entry"

**For Production Later:**
- You'll add specific IPs (your server's IP from Render, etc.)

### 5.2 Finish Configuration

Click **"Finish and Close"** or **"Close"**

---

## Step 6: Get Your Connection String

### 6.1 Navigate to Database

1. On the left sidebar, click **"Database"** (or **"Databases"**)
2. You'll see your cluster: `CCT-Cluster` with a green "Active" status

### 6.2 Connect to Cluster

1. Click the **"Connect"** button (next to your cluster name)
2. You'll see "Connect to CCT-Cluster" modal with 3 options:
   - Connect with MongoDB Shell
   - **Connect your application** ← Click this one
   - Connect with MongoDB Compass

### 6.3 Choose Connection Method

1. Click **"Drivers"** or **"Connect your application"**

2. **Driver:** Select **"Node.js"**

3. **Version:** Select **"5.5 or later"** (or latest version shown)

### 6.4 Copy Connection String

You'll see a connection string like this:

```
mongodb+srv://cct-admin:<password>@cct-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**IMPORTANT STEPS:**

1. **Copy** this entire string

2. **Replace `<password>`** with the password you created in Step 4

Example:
```
Before:
mongodb+srv://cct-admin:<password>@cct-cluster.abc123.mongodb.net/?retryWrites=true&w=majority

After:
mongodb+srv://cct-admin:xK9mP2nQ7vL4sR8t@cct-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

3. **Add Database Name** after `.mongodb.net/`:

```
mongodb+srv://cct-admin:xK9mP2nQ7vL4sR8t@cct-cluster.abc123.mongodb.net/ceylon-cargo-transport?retryWrites=true&w=majority
```

4. **Save this connection string** - you'll need it in your `.env` file!

---

## Step 7: Test Your Connection (Optional but Recommended)

### 7.1 Using MongoDB Compass (GUI Tool)

**Download MongoDB Compass:**
```
https://www.mongodb.com/try/download/compass
```

1. Install MongoDB Compass
2. Open it
3. Paste your connection string
4. Click "Connect"
5. You should see "ceylon-cargo-transport" database (it'll be created when you first connect)

### 7.2 Using Node.js (Quick Test)

Create a test file:

```javascript
// test-connection.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://cct-admin:YOUR_PASSWORD@cct-cluster.xxxxx.mongodb.net/ceylon-cargo-transport?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected successfully to MongoDB Atlas!");

    const database = client.db('ceylon-cargo-transport');
    const collections = await database.listCollections().toArray();
    console.log("📁 Collections:", collections);

  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
```

Run:
```bash
npm install mongodb
node test-connection.js
```

Should output:
```
✅ Connected successfully to MongoDB Atlas!
📁 Collections: []
```

---

## Step 8: Add Connection String to Your Project

### 8.1 Open Your Project

Navigate to:
```
d:\Projects\Sachi\CCT\ceylon-cargo-transport\apps\api\
```

### 8.2 Create .env File

If `.env` doesn't exist, create it:

**File:** `apps/api/.env`

```env
# Database Configuration
MONGODB_URI=mongodb+srv://cct-admin:YOUR_PASSWORD_HERE@cct-cluster.xxxxx.mongodb.net/ceylon-cargo-transport?retryWrites=true&w=majority

# Server
NODE_ENV=development
PORT=4000

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_REFRESH_SECRET=your-refresh-token-secret-also-change-this-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URLs (for CORS)
ADMIN_URL=http://localhost:3001
CLIENT_URL=http://localhost:3002
SHOWCASE_URL=http://localhost:3003

# Email (we'll configure this later)
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=info.cct@ceylongrp.com
SMTP_PASS=your-email-password
SMTP_FROM=info.cct@ceylongrp.com
```

### 8.3 Replace Placeholders

1. Replace `YOUR_PASSWORD_HERE` with your database password
2. Replace JWT secrets with random strings (at least 32 characters)

**Generate Random Secrets:**

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Using Online Tool**
```
https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html&rnd=new
```

---

## Step 9: Verify Everything

### ✅ Checklist

Go through this checklist:

- [ ] MongoDB Atlas account created
- [ ] Cluster is "Active" (green status)
- [ ] Database user created (username + password saved)
- [ ] IP address whitelisted
- [ ] Connection string copied
- [ ] Password replaced in connection string
- [ ] Database name added to connection string
- [ ] Connection string added to `.env` file
- [ ] (Optional) Tested connection with Compass or Node.js

---

## 🎉 Congratulations!

Your MongoDB Atlas database is ready!

**What You Have Now:**

```
✅ Database Cluster: CCT-Cluster (Mumbai/Singapore region)
✅ Database Name: ceylon-cargo-transport
✅ Database User: cct-admin
✅ Connection String: In your .env file
✅ Storage: 512 MB (Free tier)
✅ Status: Active and ready to use
```

---

## 📊 Understanding Your Free Tier Limits

**M0 Free Tier includes:**
- ✅ 512 MB storage (enough for ~100,000 shipment records)
- ✅ Shared RAM
- ✅ Shared vCPU
- ✅ No credit card required
- ✅ Never expires
- ✅ Good for development and small production apps

**Limitations:**
- ❌ Cannot use advanced features (sharding, backups)
- ❌ Shared resources (slower during peak times)
- ❌ 100 connections max

**When to Upgrade:**
- When you exceed 400 MB data
- When you need guaranteed performance
- When you launch to production

**Upgrade Cost:**
- M10 (2 GB RAM, 10 GB storage): **$9/month**
- M20 (4 GB RAM, 20 GB storage): **$28/month**

---

## 🔧 Common Issues & Solutions

### Issue 1: "Authentication failed"

**Problem:** Wrong password in connection string

**Solution:**
1. Check password has no special characters causing issues
2. If password has special characters, URL encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`

Or: Reset password in Atlas → Database Access → Edit User → Reset Password

---

### Issue 2: "Connection timeout"

**Problem:** IP not whitelisted

**Solution:**
1. Go to Network Access in Atlas
2. Add `0.0.0.0/0` for development
3. Wait 1-2 minutes for changes to apply

---

### Issue 3: "Database not found"

**Problem:** Database name not in connection string

**Solution:**
Add `/ceylon-cargo-transport` after `.mongodb.net/`:
```
mongodb+srv://...mongodb.net/ceylon-cargo-transport?retryWrites=true...
```

---

### Issue 4: "Cannot connect from my IP"

**Problem:** Your IP changed (common with home internet)

**Solution:**
1. Go to Network Access
2. Click "Add IP Address"
3. Click "Add Current IP Address"
4. Or use `0.0.0.0/0` for any IP

---

## 📱 MongoDB Atlas Mobile App

**Bonus:** Monitor your database on your phone!

Download the MongoDB Atlas app:
- iOS: https://apps.apple.com/app/id1544988885
- Android: https://play.google.com/store/apps/details?id=com.mongodb.atlas

Features:
- Check cluster status
- View database metrics
- Get alerts
- Manage users

---

## 🚀 Next Steps

Now that your database is ready:

1. **Test the connection** (recommended)
2. **Create database models** (Mongoose schemas)
3. **Build the API** (Express routes)

**Ready to continue?**

Reply with:
- **"Database is ready, what's next?"**
- **"Generate database models"**
- **"Start building the API"**

And I'll create all the necessary code files! 🎯

---

## 📝 Save This Information

**Keep these details safe:**

```
MongoDB Atlas Credentials:
========================
Email: [your-atlas-account-email]
Password: [your-atlas-account-password]

Database Connection:
===================
Cluster: CCT-Cluster
Region: Mumbai/Singapore
User: cct-admin
Password: [your-db-password]
Database: ceylon-cargo-transport
Connection String: [saved in .env file]

Free Tier: M0
Storage: 512 MB
Status: Active
```

Store this in:
- Password manager (1Password, LastPass, etc.)
- Secure notes app
- Encrypted file

**NEVER commit .env file to Git!** (Already in .gitignore)

---

## 🎓 Learn More

**MongoDB Atlas Documentation:**
- Getting Started: https://docs.atlas.mongodb.com/getting-started/
- Connection Strings: https://docs.atlas.mongodb.com/connect-to-cluster/
- Security Best Practices: https://docs.atlas.mongodb.com/security-best-practices/

**MongoDB University (Free Courses):**
- https://university.mongodb.com/

---

**Questions? Issues? Let me know and I'll help!** 🚀
