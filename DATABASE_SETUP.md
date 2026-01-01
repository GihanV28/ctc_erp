# Ceylon Cargo Transport - Database Setup & Testing Guide

## MongoDB Atlas Cluster Overview

**Cluster Name:** CCT-Cluster
**Database Name:** `cct_cargo`
**Connection String:** See `.env` file

## Current Database State

### ✅ Collections Populated (Ready for Testing)

1. **clients** (1 document)
   - Demo Trading Company with full profile

2. **roles** (4 documents)
   - admin, manager, staff, client roles with permissions

3. **users** (4 documents)
   - Admin, Manager, Staff, and Client users

4. **suppliers** (3 documents)
   - Maersk Line (ocean freight)
   - DHL Global Forwarding (air freight)
   - Sri Lanka Customs Services (customs)

5. **shipments** (4 documents)
   - Various statuses: pending, in_transit, customs, delivered
   - Linked to client and suppliers

6. **containers** (6 documents)
   - Different types and statuses
   - Some linked to shipments

7. **invoices** (3 documents)
   - Paid and sent invoices
   - Linked to client and shipments

### 🗑️ Databases to Delete Manually

- **cct_database** - Old/duplicate database
- **sample_mflix** - MongoDB sample dataset (not needed)

Keep only:
- **admin** (system database)
- **cct_cargo** (your application database)
- **local** (system database)

## Test Data Summary

### User Accounts for Testing

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@ceylongrp.com | Admin@123 | Full system access |
| Manager | manager@ceylongrp.com | Manager@123 | Operations management |
| Staff | staff@ceylongrp.com | Staff@123 | Limited access |
| Client | client@example.com | Client@123 | Portal access |

⚠️ **IMPORTANT:** Change these passwords before production deployment!

### Sample Data Breakdown

#### 1. Clients (1)
- **CLT-001**: Demo Trading Company
  - Contact: Demo Client
  - Email: client@example.com
  - Location: Colombo, Sri Lanka
  - Payment Terms: 30 days
  - Credit Limit: $50,000

#### 2. Suppliers (3)
- **SUP-001**: Maersk Line (Ocean Freight) - Rating: 4.8★
- **SUP-002**: DHL Global Forwarding (Air Freight) - Rating: 4.6★
- **SUP-003**: Sri Lanka Customs Services (Customs) - Rating: 4.5★

#### 3. Shipments (4)
- **SHP-001**: Shanghai → Colombo (In Transit)
  - Electronics and Computer Parts
  - 2x 40ft containers
  - Cost: $8,500

- **SHP-002**: Dubai → Colombo (Customs Clearance)
  - Textiles and Garments
  - 1x 20ft container
  - Cost: $4,200

- **SHP-003**: Singapore → Colombo (Delivered)
  - Machinery Parts
  - 2x 40ft High Cube containers
  - Cost: $12,000

- **SHP-004**: Rotterdam → Colombo (Pending)
  - Automotive Parts
  - 2x 40ft containers
  - Cost: $15,000

#### 4. Containers (6)
- **CNT-001**: MSCU1234567 (40ft Standard - In Use)
- **CNT-002**: MSCU7654321 (40ft Standard - In Use)
- **CNT-003**: HLCU9876543 (20ft Standard - In Use)
- **CNT-004**: SEGU5555555 (40ft High Cube - Available)
- **CNT-005**: CSNU8888888 (40ft Standard - Available)
- **CNT-006**: TEMU3333333 (20ft Refrigerated - Maintenance)

#### 5. Invoices (3)
- **INV-001**: CCT-INV-2024-001 (Paid) - $12,000
- **INV-002**: CCT-INV-2024-002 (Sent) - $8,500
- **INV-003**: CCT-INV-2024-003 (Sent) - $4,200

## Database Seeding Scripts

### Initial Seed (Users, Roles, Clients)
```bash
cd apps/api
npm run seed
```

### Additional Test Data (Suppliers, Shipments, Containers, Invoices)
```bash
cd apps/api
npm run seed:additional
```

### Full Seed (Both Scripts)
```bash
cd apps/api
npm run seed:all
```

## Testing Use Cases

### 1. Authentication & Authorization
- ✅ Login with different user roles
- ✅ Test permission-based access
- ✅ Verify role-based UI rendering

### 2. Client Management
- ✅ View client profile
- ✅ Create new clients
- ✅ Update client information
- ✅ Search and filter clients

### 3. Supplier Management
- ✅ View all suppliers
- ✅ Filter by service type
- ✅ View supplier ratings and contracts
- ✅ Add new suppliers

### 4. Shipment Tracking
- ✅ View shipments by status
- ✅ Track shipment progress
- ✅ Update shipment status
- ✅ View shipment details with cargo info
- ✅ Filter by origin/destination
- ✅ Search by tracking number

### 5. Container Management
- ✅ View all containers
- ✅ Filter by status (available, in use, maintenance)
- ✅ Link containers to shipments
- ✅ View container inspection history
- ✅ Filter by container type

### 6. Invoice & Billing
- ✅ View all invoices
- ✅ Filter by status (draft, sent, paid, overdue)
- ✅ Create new invoices
- ✅ View invoice details with line items
- ✅ Mark invoices as paid
- ✅ Generate invoice reports

### 7. Dashboard & Reports
- ✅ View shipment statistics
- ✅ View revenue metrics
- ✅ View container utilization
- ✅ View supplier performance
- ✅ Filter by date ranges

### 8. Client Portal (client@example.com)
- ✅ View own shipments only
- ✅ View own invoices only
- ✅ Track shipments
- ✅ Submit support tickets
- ✅ Update profile

## Additional Collections Needed (Not Yet Created)

For complete functionality, you may need to create these collections:

### 1. **tracking_updates** (Shipment Status Updates)
```javascript
{
  shipmentId: ObjectId,
  status: String,
  location: String,
  description: String,
  timestamp: Date,
  updatedBy: ObjectId (User)
}
```

### 2. **support_tickets** (Customer Support)
```javascript
{
  ticketId: String,
  client: ObjectId,
  subject: String,
  description: String,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high',
  assignedTo: ObjectId (User),
  messages: [{
    sender: ObjectId (User),
    message: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **notifications** (System Notifications)
```javascript
{
  user: ObjectId,
  type: 'shipment_update' | 'invoice' | 'payment' | 'system',
  title: String,
  message: String,
  read: Boolean,
  link: String,
  createdAt: Date
}
```

### 4. **documents** (File Uploads)
```javascript
{
  documentId: String,
  type: 'invoice' | 'shipment_doc' | 'contract' | 'other',
  relatedTo: ObjectId,
  relatedModel: 'Shipment' | 'Invoice' | 'Client',
  fileName: String,
  filePath: String,
  fileSize: Number,
  uploadedBy: ObjectId (User),
  createdAt: Date
}
```

### 5. **audit_logs** (Activity Tracking)
```javascript
{
  user: ObjectId,
  action: String,
  resource: String,
  resourceId: ObjectId,
  changes: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

## MongoDB Atlas Configuration

### 1. Network Access
- ✅ IP Whitelist configured with `0.0.0.0/0` (allow all)
- ⚠️ For production, restrict to specific IPs

### 2. Database User
- ✅ Username: cct-admin
- ✅ Password: (stored in .env)
- ✅ Role: Read/Write access to cct_cargo database

### 3. Connection Settings
- ✅ DNS configured to use Google DNS (8.8.8.8, 8.8.4.4)
- ✅ IPv4 family enforced
- ✅ Database name explicitly set to `cct_cargo`

## Environment Configuration

Ensure your `.env` file has:

```env
MONGODB_URI=mongodb+srv://cct-admin:tqXsDgQzWu0imDYe@cct-cluster.rwkaked.mongodb.net/cct_cargo?retryWrites=true&w=majority&appName=CCT-Cluster
```

## Common Issues & Solutions

### Issue: DNS Resolution Failure
**Solution**: Ensure Google DNS (8.8.8.8, 8.8.4.4) is configured for both IPv4 and IPv6

### Issue: IP Whitelist Error
**Solution**: Add `0.0.0.0/0` to IP Access List in MongoDB Atlas (development only)

### Issue: Connection Timeout
**Solution**: Check if MongoDB Atlas cluster is active and deployment is complete

### Issue: Duplicate Key Error
**Solution**: Run cleanup script or manually delete existing documents

## Next Steps for Production

1. **Security**
   - [ ] Change all default passwords
   - [ ] Restrict IP whitelist to specific IPs
   - [ ] Enable 2FA for admin accounts
   - [ ] Implement password rotation policy

2. **Data**
   - [ ] Remove test data
   - [ ] Import real client data
   - [ ] Set up automated backups

3. **Monitoring**
   - [ ] Set up MongoDB Atlas monitoring
   - [ ] Configure alerts for performance issues
   - [ ] Enable audit logging

4. **Optimization**
   - [ ] Create appropriate indexes
   - [ ] Implement data archiving for old shipments
   - [ ] Configure connection pooling

## Support

For issues or questions:
- Check MongoDB Atlas Activity Feed for deployment status
- Review connection logs in the API server
- Contact system administrator

---

**Last Updated**: 2024-01-28
**Database Version**: MongoDB 7.0
**Seed Script Version**: 1.0
